import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import GoogleIcon from "../components/GoogleIcon";

export default function Login() {
  const { register, handleSubmit, formState: {errors} } = useForm();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const user = await login(data.email, data.password);
      toast.success("Login successfully");

      if (!user.profileCompleted) {
        navigate(`/${user.role}/profile`);
      } else {
        navigate(`/${user.role}/dashboard`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async() =>{
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`
  }

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Card */}
      <div className="relative z-10 bg-white rounded-2xl shadow-md w-full max-w-md p-8">
        <div className="flex items-center gap-2 text-blue-600 font-bold text-xl mb-6">
          <img src="/favicon.png" alt="logo" className="w-12 h-12" />
          <span>HealthConnect</span>
        </div>

        <h2 className="text-4xl font-bold">Welcome back</h2>

        <p className="text-gray-500 mt-2">
          Log in to manage your health records securely
        </p>

        {/* Email */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="flex items-center rounded-lg border border-gray-300 px-3 py-3 focus-within:border-blue-600">
              <Mail className="text-gray-400" />
              <input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Please enter a valid email address",
                  },
                })}
                className="ml-3 w-full outline-none"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm mb-1 mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="flex relative mb-2 items-center rounded-lg border border-gray-300 px-3 py-3 focus-within:border-blue-600">
              <Lock className="text-gray-400" />
              <input
                {...register("password", {required: "Password is required"})}
                type={showPassword ? "text" : "password"}
                placeholder="password"
                className="ml-3 w-full outline-none"
              />
                <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? (
                  <EyeOff className="cursor-pointer text-gray-400" />
                ) : (
                  <Eye className="cursor-pointer text-gray-400" />
                )}
              </button>
            </div>
             {errors.password && (
              <p className="text-red-500 text-sm mb-2">{errors.password.message}</p>
            )}
            <div className="flex justify-between">
              <div className="flex space-x-2">
              <input
              type="checkbox"
              className="mt-1 h-4 w-4 accent-blue-600"
            />
            <p className=" text-gray-700">
             Remember me</p>
             </div>
           <Link to="/reset-password" className="text-blue-500 mb-2 font-medium hover:text-blue-600 hover:underline cursor">Forgot Password</Link>
           </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className={`flex w-full items-center justify-center gap-2 rounded-lg p-3 ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-cyan-500 hover:scale-105 hover:shadow-xl"
            }`}
          >
            {loading ? "login..." : "Login"}
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>
        {/* Signup */}
        <p className="text-center mt-8 text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 font-semibold hover:underline"
          >
            Sign Up
          </Link>
              <div>
      {/* baaki login form */}

      <div className="my-4 flex items-center gap-2">
        <div className="flex-1 border-t"></div>
        <span className="text-sm text-gray-400">or</span>
        <div className="flex-1 border-t"></div>
      </div>

      <button
        type="submit"
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center gap-3 border rounded-lg py-3 hover:bg-gray-50"
      >
        <GoogleIcon />
        <span className="text-sm font-medium text-gray-700">Continue with Google</span>
      </button>
    </div>

        </p>
      </div>
    </div>
  );
}
