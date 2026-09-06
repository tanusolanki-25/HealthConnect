import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import { Lock, Eye, EyeOff, ArrowLeft, Loader2, KeyRound, CheckCircle2 } from "lucide-react";

function ResetPassword() {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast.error("Please fill in both password fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password should be at least 6 characters long");
      return;
    }

    setLoading(true);
    try {
      await api.post(`/auth/reset-password/${token}`, { newPassword });
      toast.success("Password reset successfully — please log in");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Reset link invalid or expired");
    } finally {
      setLoading(false);
    }
  };

  const passwordsMatch = newPassword && confirmPassword && newPassword === confirmPassword;

  return (
    <div className="h-[calc(100vh-4rem)] overflow-y-auto bg-slate-50 flex items-center justify-center">
            <div className="max-w-md w-full bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-100 overflow-hidden">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center gap-2 mb-4">
            <img src="/favicon.png" alt="HealthConnect Logo" className="w-10 h-10 object-contain" />
            <span className="text-2xl font-bold text-blue-600 tracking-tight">HealthConnect</span>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center mb-3">
            <KeyRound size={24} />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Reset Your Password
          </h1>
          <p className="text-gray-500 mt-2 text-xs sm:text-sm">
            Enter your new password below to secure your account.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* New Password */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              New Password
            </label>
            <div className="relative flex items-center rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-3 transition-all focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/20">
              <Lock size={18} className="text-gray-400 mr-3 shrink-0" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-transparent outline-none text-gray-900 text-sm placeholder:text-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600 ml-2 focus:outline-none"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Confirm New Password
            </label>
            <div className="relative flex items-center rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-3 transition-all focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/20">
              <Lock size={18} className="text-gray-400 mr-3 shrink-0" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-transparent outline-none text-gray-900 text-sm placeholder:text-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-gray-400 hover:text-gray-600 ml-2 focus:outline-none"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Password Match Status */}
          {confirmPassword && (
            <div className="flex items-center gap-1.5 text-xs font-medium pt-1">
              {passwordsMatch ? (
                <span className="text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 size={14} /> Passwords match
                </span>
              ) : (
                <span className="text-rose-500">Passwords do not match</span>
              )}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full mt-2 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-semibold text-white shadow-md transition-all duration-200 ${
              loading
                ? "bg-blue-400 cursor-not-allowed shadow-none"
                : "bg-blue-600 hover:bg-blue-700 active:scale-[0.99] shadow-blue-500/25"
            }`}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Resetting Password...</span>
              </>
            ) : (
              <span>Reset Password</span>
            )}
          </button>
        </form>

        {/* Back Link */}
        <div className="mt-8 text-center border-t border-gray-100 pt-5">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to Login</span>
          </Link>
        </div>

      </div>
    </div>
  );
}

export default ResetPassword;