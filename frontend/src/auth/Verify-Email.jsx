import { useState } from "react";
import api from "../api/axios";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function VerifyEmail() {
  const { register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const email = location.state?.email;

  const { user, setUser, checkProfileCompleted } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    const otp = data.otp;
    try {
      const res = await api.post("/auth/verify-email", { email, otp });
      reset();
      const loggedInUser = res.data.data.user;
      const profileCompleted = await checkProfileCompleted(loggedInUser.role);
      const fullUser = { ...loggedInUser, profileCompleted };
      setUser(fullUser);
      toast.success("User logged in Successfully");

      if (!fullUser.profileCompleted) {
        navigate(`/${fullUser.role}/profile`);
      } else {
        navigate(`/${fullUser.role}/dashboard`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    toast.success("New OTP sent Successfully");
    try {
      await api.post("/auth/resend-otp", { email });
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Card */}
      <div className="relative z-10 bg-white rounded-xl shadow-md w-full max-w-md p-5">
        <div className="flex justify-center items-center gap-2 text-blue-600 font-bold text-xl">
          <img src="/favicon.png" alt="logo" className="w-12 h-12" />
          <span>HealthConnect</span>
        </div>

        <h2 className="text-gray-400 text-center">Email Verification</h2>
        {/* Email */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              OTP sent to: {email}
            </label>

            <div className="flex items-center rounded-lg border border-gray-300 px-3 py-3 focus-within:border-blue-600">
              <input
                {...register("otp")}
                type="text"
                placeholder="OTP"
                className="w-full outline-none"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleResendOtp}
                className="text-blue-400 underline mb-4 hover:text-blue-700 cursor-pointer"
              >
                Resend OTP
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`flex w-full items-center justify-center gap-2 rounded-lg p-3 ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-cyan-500 hover:scale-105 hover:shadow-xl"
            }`}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      </div>
    </div>
  );
}
