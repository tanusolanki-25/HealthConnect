import { Mail, Lock, Eye, ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios"
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function Login() {
 const { register, handleSubmit, reset } = useForm({ defaultValues: { role: "patient" } })
 const {login} = useAuth()
 const navigate = useNavigate()

 const onSubmit = async (data) => {
  try {
    const user = await login(data.email, data.password)
    toast.success("Login successfully")

    if(!user.profileCompleted){
      navigate(`/${user.role}/profile`)
    }
    else{
      navigate(`/${user.role}/dashboard`)
    }
  } catch (error) {
     toast.error(error.response?.data?.message || "Login Failed")
  }
};

  return (
    <div className="min-h-screen bg-[#f5f7ff] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Card */}
      <div className="relative z-10 bg-white rounded-2xl shadow-md w-full max-w-md p-8 mt-10">
        <div className="flex items-center gap-2 text-blue-600 font-bold text-xl mb-6">
          <img src="/favicon.png" alt="logo" className="w-12 h-12" />
          <span>HealthConnect</span>
        </div>

        <h2 className="text-4xl font-bold">Welcome back</h2>

        <p className="text-gray-500 mt-2">
          Log in to manage your health records securely
        </p>

        {/* Email */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Email 
            </label>
            <div className="flex items-center rounded-lg border border-gray-300 px-3 py-3 focus-within:border-blue-600">
              <Mail className="text-gray-400" />
              <input
                {...register("email")}
                type="email"
                placeholder="sarah.smith@hospital.com"
                className="ml-3 w-full outline-none"
              />
            </div>
          </div>
        
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="flex items-center rounded-lg border border-gray-300 px-3 py-3 focus-within:border-blue-600">
              <Lock className="text-gray-400" />
              <input
                {...register("password")}
                type="password"
                placeholder="password"
                className="ml-3 w-full outline-none"
              />
              <Eye className="cursor-pointer text-gray-400" />
            </div>
          </div>

          {/* Login Button */}
          <button className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 font-semibold flex items-center justify-center gap-2 transition">
            Log In
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
        </p>
      </div>
    </div>
  );
}
