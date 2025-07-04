import { useState } from "react";
import toast from "react-hot-toast";
import { Mail, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const { forgotPassword, isSendingResetLink } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return toast.error("Email is required");
    await forgotPassword(email);
  };

  return (
    <div className="min-h-screen grid place-items-center px-4">
      <div className="w-full max-w-md bg-base-300 rounded-xl p-8 shadow space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Forgot Password</h2>
          <p className="text-sm text-base-content/60">
            Enter your email to receive a password reset link.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Email</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="size-5 text-base-content/40" />
              </div>
              <input
                type="email"
                className="input input-bordered w-full pl-10"
                placeholder="madiwal@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full" disabled={isSendingResetLink}>
            {isSendingResetLink ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Reset Link"
            )}
          </button>

          <p className="text-center text-sm mt-2">
            Remembered your password?{" "}
            <Link to="/login" className="link link-primary">
              Back to Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
