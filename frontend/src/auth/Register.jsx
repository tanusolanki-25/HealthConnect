import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Mail, Lock, Eye } from "lucide-react";
import { useState } from "react";
import api from "../api/axios";

function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, reset } = useForm({
    defaultValues: { role: "patient" },
  });

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await api.post("/auth/register", data);
      toast.success("Account created — please log in");
      reset();
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    }finally{
      setLoading(false)
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50/50 p-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <div className="flex items-center gap-2 text-blue-600 font-bold text-xl">
          <img src="/favicon.png" alt="logo" className="w-12 h-12" />
          <span>HealthConnect</span>
        </div>
        <h1 className="mt-6 text-4xl font-bold text-gray-800">
          Create your account
        </h1>
        <p className="mt-2 text-gray-500">
          Join thousands of patients and providers
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Email Address
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

          {/* Password */}
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

          {/* Checkbox */}
          <div className="flex items-start gap-2">
            <input
              {...register("agreedToTerms")}
              type="checkbox"
              className="mt-1 h-4 w-4 accent-blue-600"
            />
            <p className="text-sm text-gray-500">
              I agree to the{" "}
              <span className="font-medium text-blue-600 cursor-pointer">
                Terms of Service
              </span>{" "}
              and{" "}
              <span className="font-medium text-blue-600 cursor-pointer">
                Privacy Policy
              </span>
              .
            </p>
          </div>

          {/* Role selection */}
          <div className="space-y-2">
            <p className="text-sm text-gray-600">I am a...</p>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input type="radio" value="patient" {...register("role")} />{" "}
                Patient
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" value="doctor" {...register("role")} />{" "}
                Doctor
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" value="hospital" {...register("role")} />{" "}
                Hospital
              </label>
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
          {loading ? "Uploading..." : "Register"} 
          </button>
        </form>

        <p className="mt-8 text-center text-gray-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="cursor-pointer font-semibold text-blue-600 hover:underline"
          >
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
