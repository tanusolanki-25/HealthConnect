import { useState } from "react";
import api from "../api/axios";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { Mail, KeyRound, ArrowRight, ArrowLeft, RefreshCw, Loader2, ShieldCheck } from "lucide-react";

export default function VerifyEmail() {
  const { register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const location = useLocation();
  const email = location.state?.email || "your registered email";

  const { setUser, checkProfileCompleted } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    if (!data.otp || !data.otp.trim()) {
      toast.error("Please enter the OTP code");
      return;
    }

    setLoading(true);
    const otp = data.otp.trim();
    try {
      const res = await api.post("/auth/verify-email", { email, otp });
      reset();
      const loggedInUser = res.data.data.user;
      const profileCompleted = await checkProfileCompleted(loggedInUser.role);
      const fullUser = { ...loggedInUser, profileCompleted };
      setUser(fullUser);
      toast.success("Email verified successfully!");

      if (!fullUser.profileCompleted) {
        navigate(`/${fullUser.role}/profile`);
      } else {
        navigate(`/${fullUser.role}/dashboard`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Verification Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResending(true);
    try {
      await api.post("/auth/resend-otp", { email });
      toast.success("A new OTP code has been sent to your email!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not resend OTP");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-100">
        
        {/* Header with Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center gap-2 mb-4">
            <img src="/favicon.png" alt="HealthConnect Logo" className="w-10 h-10 object-contain" />
            <span className="text-2xl font-bold text-blue-600 tracking-tight">HealthConnect</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold tracking-wide uppercase mb-3 border border-blue-100">
            <ShieldCheck size={14} /> Verification Required
          </div>

          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Check Your Email
          </h1>
          
          <div className="mt-3 inline-flex items-center gap-2 bg-gray-100/80 px-3.5 py-1.5 rounded-full text-xs font-medium text-gray-700 max-w-full truncate">
            <Mail size={14} className="text-blue-600 shrink-0" />
            <span className="truncate">{email}</span>
          </div>
        </div>

        {/* OTP Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Enter 6-Digit OTP Code
            </label>

            <div className="relative flex items-center rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-3 transition-all focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/20">
              <KeyRound size={20} className="text-gray-400 mr-3 shrink-0" />
              <input
                {...register("otp")}
                type="text"
                maxLength={6}
                placeholder="123456"
                className="w-full bg-transparent outline-none text-gray-900 font-mono tracking-widest text-lg placeholder:tracking-normal placeholder:font-sans placeholder:text-gray-400 placeholder:text-sm"
              />
            </div>
          </div>

          {/* Resend Action */}
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-gray-500">Didn't receive the code?</span>
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={resending}
              className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-700 hover:underline disabled:text-gray-400"
            >
              <RefreshCw size={12} className={resending ? "animate-spin" : ""} />
              {resending ? "Resending..." : "Resend OTP"}
            </button>
          </div>

          {/* Verify Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-semibold text-white shadow-md transition-all duration-200 ${
              loading
                ? "bg-blue-400 cursor-not-allowed shadow-none"
                : "bg-blue-600 hover:bg-blue-700 active:scale-[0.99] shadow-blue-500/25"
            }`}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <span>Verify & Login</span>
                <ArrowRight size={18} />
              </>
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
