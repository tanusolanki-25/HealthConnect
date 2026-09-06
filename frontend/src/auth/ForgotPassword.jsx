import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import { Mail, ArrowLeft, Loader2, KeyRound, CheckCircle2, Send } from "lucide-react";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.trim()) {
      toast.error("Please enter your registered email");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email: email.trim() });
      setSent(true);
      toast.success("Reset link sent successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
    <div className="h-[calc(100vh-4rem)] overflow-y-auto bg-slate-50 flex items-center justify-center ">
      <div className="max-w-md w-full bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-100 overflow-hidden">
          
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center mb-4 border border-emerald-100">
            <CheckCircle2 size={30} />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Check Your Inbox</h2>
          <p className="text-gray-500 text-sm mt-3 leading-relaxed">
            We sent a password reset link to <span className="font-semibold text-gray-800">{email}</span> if it is associated with a HealthConnect account.
          </p>

          <div className="mt-8 space-y-3">
            <button
              onClick={() => setSent(false)}
              className="w-full py-3 px-4 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
            >
              Try another email
            </button>

            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-1.5 w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-sm font-semibold text-white shadow-md transition"
            >
              <ArrowLeft size={16} />
              <span>Back to Login</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] overflow-y-auto bg-slate-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-100 overflow-hidden hide-scrollbar">
   
        {/* Header */}
        <div className="text-center mb-8 ">
          <div className="inline-flex items-center justify-center gap-2 mb-4">
            <img src="/favicon.png" alt="HealthConnect Logo" className="w-10 h-10 object-contain" />
            <span className="text-2xl font-bold text-blue-600 tracking-tight">HealthConnect</span>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center mb-3">
            <KeyRound size={24} />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Forgot Password?
          </h1>
          <p className="text-gray-500 mt-2 text-xs sm:text-sm">
            No worries! Enter your email and we'll send you a password reset link.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Registered Email Address
            </label>
            <div className="relative flex items-center rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-3 transition-all focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/20">
              <Mail size={18} className="text-gray-400 mr-3 shrink-0" />
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent outline-none text-gray-900 text-sm placeholder:text-gray-400"
              />
            </div>
          </div>

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
                <span>Sending Reset Link...</span>
              </>
            ) : (
              <>
                <span>Send Reset Link</span>
                <Send size={16} />
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

export default ForgotPassword;