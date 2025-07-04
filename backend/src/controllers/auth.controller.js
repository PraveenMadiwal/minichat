
import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";


export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;

    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must contain at least 6 characters" });
        }

        const user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "Email already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password: hashPassword,
        });

        await newUser.save();

        const token = generateToken(newUser._id, res);
        console.log("Sending cookie with token:", token);

        return res.status(201).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            email: newUser.email,
            profilePic: newUser.profilePic,
        });

    } catch (error) {
        console.log("error in signup controller (authController)", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}


export const login = async(req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid password" });
    }

    generateToken(user._id, res); // ✅ this sets the cookie

    res.status(200).json({
  _id: user._id,
  fullName: user.fullName,
  email: user.email,
  profilePic: user.profilePic,
});


  } catch (error) {
    console.log("error in Login controller (auth controller):", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Send reset password link
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const token = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetLink = `http://localhost:5173/reset-password/${token}`; // Frontend reset link
    console.log("Reset link:", resetLink); // Replace with email sending

    res.status(200).json({ message: "Password reset link sent to email" });
  } catch (err) {
    console.log("forgotPassword error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Reset password
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }, // token not expired
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    console.log("resetPassword error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


export const logout = (req, res)=> {
    try{
        res.cookie("jwt", "", {maxAge:0})
        res.status(200).json({massage: "Logged out successfully"})

    }catch(error){
        console.log("error in Logout controller", error.message);
        //500 used for server error
        res.status(500).json({message: "Intenal server error"})
    }
}

export const updateProfile = async (req, res) => {
  try {
    console.log("Incoming updateProfile request:", req.body);
    console.log("User from token middleware:", req.user);

    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const updateData = {};

    if (req.body.profilePic) {
      console.log("Uploading image to Cloudinary...");
      const upload = await cloudinary.uploader.upload(req.body.profilePic);
      updateData.profilePic = upload.secure_url;
    }

    if (req.body.fullName) updateData.fullName = req.body.fullName;
    if (req.body.email) updateData.email = req.body.email;

    console.log("Update data for MongoDB:", updateData);

    const updated = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    }).select("-password");

    if (!updated) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updated);
  } catch (err) {
    console.error("UpdateProfile ERROR:", err);
    if (err.code === 11000) {
      return res.status(400).json({ message: "Email already exists" });
    }
    res.status(500).json({ message: err.message || "Server error" });
  }
};


export const checkAuth = async(req, res) =>{
    try{
        res.status(200).json(req.user)

    }catch(error){      
        console.log("error in check controller", error.message);
        //500 used for server error 
        res.status(500).json({message: "Intenal server error"})
    }
}