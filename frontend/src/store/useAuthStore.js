import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = "http://localhost:5000"

export const useAuthStore = create((set, get)  => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingPofile:false,
    onlineUsers:[],
    socket: null,

    isCheckingAuth: true,
  isSendingResetLink: false,
  isResettingPassword: false,

    checkAuth: async() =>{
        try{
            const res = await axiosInstance.get("/auth/check");

            set({authUser: res.data})
            get().connectSocket();
        }catch(error){
            console.log("error in checkauth: "+ error)
            set({
                authUser: null
            })
        }finally{
            set({isCheckingAuth: false});
        }
    },
    signup: async(data) =>{
        set({isSigningUp: true});
        try{
           const res = await axiosInstance.post("/auth/signup", data);
           set({authUser: res.data})
           toast.success("Account created successfully");
           console.log("JWT cookie set");

           get().connectSocket();

        }catch(error){
           console.error("Signup error:", error);
           toast.error(error.response?.data?.message);
        }finally{
            set({isSigningUp: false});
        }
    },
    
    login: async(data) =>{
        set({isLoggingIn: true});
        try{
            const res = await axiosInstance.post("/auth/login", data);

            set({authUser: res.data});
            toast.success("Logged in successfully");

            get().connectSocket();
        }catch (error) {
            const msg = error?.response?.data?.message || "Login failed";
            toast.error(msg);
        }finally{
            set({isLoggingIn: false});
        }
    },

    logout: async () =>{
        try{
            await axiosInstance.post("/auth/logout");
            set({authUser: null});
            toast.success("Logged out successfully");
            get().disconnectSocket()
        }catch(error){
            toast.error(error.response.data.message);
        }
    },
    updateProfile: async (data) => {
  set({ isUpdatingProfile: true });
  try {
    const res = await axiosInstance.put("/auth/update-profile", data);
    set({ authUser: res.data });
    toast.success("Profile updated successfully");
  } catch (error) {
    const msg = error?.response?.data?.message || "Update failed";
    toast.error(msg);
  } finally {
    set({ isUpdatingProfile: false });
  }
},


  forgotPassword: async (email) => {
    set({ isSendingResetLink: true });
    try {
      const res = await axiosInstance.post("/auth/forgot-password", { email });
      toast.success(res.data.message || "Reset link sent to your email");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error sending reset link");
    } finally {
      set({ isSendingResetLink: false });
    }
  },

  resetPassword: async (token, password, navigate) => {
    set({ isResettingPassword: true });
    try {
      const res = await axiosInstance.post(`/auth/reset-password/${token}`, { password });
      toast.success(res.data.message || "Password reset successful");
      navigate("/login");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error resetting password");
    } finally {
      set({ isResettingPassword: false });
    }
  },
  connectSocket: () => {
    const { authUser } = get()
    if(!authUser || get().socket?.connected) return;
      const socket = io(BASE_URL, {
        query: {
          userId : authUser._id,
        },
      });
      socket.connect();

      set({socket:socket});

      socket.on("setOnlineUsers", (userIds) =>{
        set({onlineUsers: userIds})
      })
  },
  disconnectSocket: () => {
      if(get().socket?.connected) get().socket.disconnect();
  },
        
}))