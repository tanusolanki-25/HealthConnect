import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Mail, Lock,  ShieldCheck, HeartPulse, CheckCircle2, UserCheck, ArrowRight } from "lucide-react";
import { useState } from "react";
import api from "../api/axios";

function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { role: "patient" },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await api.post("/auth/register", data);
      toast.success("Account created — please log in");
      reset();
      navigate("/verify-email", {
        state: {
          email: data.email,
        },
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" bg-slate-50/80 flex items-center justify-center p-5">
      {/* Main Card Container */}
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-11 min-h-[600px] border border-gray-100">
        
        {/* Left Side: Hero Image & Branding */}
        <div className="lg:col-span-5 relative hidden lg:flex flex-col justify-between p-10 bg-gradient-to-br from-blue-700 via-blue-600 to-teal-600 text-white overflow-hidden">
          {/* Background Image with Overlay */}
          <div 
            className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-30"
            style={{ 
              backgroundImage: `url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1000&q=80')` 
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-950/80 via-blue-900/40 to-transparent" />

          {/* Decorative Glowing Orbs */}
          <div className="absolute -top-16 -left-16 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-teal-400/20 rounded-full blur-3xl" />

          {/* Top Logo */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="p-2.5 bg-white/15 backdrop-blur-md rounded-2xl border border-white/20 shadow-inner">
              <img src="/favicon.png" alt="logo" className="w-8 h-8 object-contain" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-white">HealthConnect</span>
          </div>

          {/* Middle Content */}
          <div className="relative z-10 my-auto py-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-blue-100 border border-white/20 mb-6">
              <HeartPulse className="w-4 h-4 text-teal-300" />
              <span>Smart Healthcare Platform</span>
            </div>
            
            <h1 className="text-3xl xl:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Your Health Journey Starts Here.
            </h1>
            <p className="mt-4 text-blue-100 text-sm leading-relaxed">
              Connect with top doctors, manage appointments seamlessly, and keep your health records safe in one secure portal.
            </p>

            {/* Feature Bullet Points */}
            <div className="mt-8 space-y-3.5">
              <div className="flex items-center gap-3 text-xs sm:text-sm font-medium text-blue-50">
                <CheckCircle2 className="w-5 h-5 text-teal-300 flex-shrink-0" />
                <span>24/7 Access to Verified Specialists</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm font-medium text-blue-50">
                <ShieldCheck className="w-5 h-5 text-teal-300 flex-shrink-0" />
                <span>Encrypted & HIPAA Compliant Data</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm font-medium text-blue-50">
                <UserCheck className="w-5 h-5 text-teal-300 flex-shrink-0" />
                <span>Instant Digital Prescriptions & Reports</span>
              </div>
            </div>
          </div>

          {/* Bottom Card / Trust Metric */}
          <div className="relative z-10 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-blue-200">Trusted by over</p>
                <p className="text-lg font-bold text-white">10,000+ Patients</p>
              </div>
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-blue-400 border-2 border-white flex items-center justify-center text-xs font-bold">DR</div>
                <div className="w-8 h-8 rounded-full bg-teal-400 border-2 border-white flex items-center justify-center text-xs font-bold">PT</div>
                <div className="w-8 h-8 rounded-full bg-indigo-400 border-2 border-white flex items-center justify-center text-xs font-bold">RN</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="lg:col-span-6 p-6 sm:p-10 lg:p-10 lg:ml-10 lg:mr-10 lg:mt-10 flex flex-col justify-center">
          {/* Mobile Header / Branding */}
          <div className="flex items-center gap-2 text-blue-600 font-bold text-xl lg:hidden mb-6">
            <img src="/favicon.png" alt="logo" className="w-10 h-10" />
            <span>HealthConnect</span>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Create an account
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Join HealthConnect to manage your healthcare journey today.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Email Address
              </label>
              <div className="relative flex items-center rounded-xl border border-gray-300 px-3.5 py-3 transition-all duration-200 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 bg-gray-50/50 focus-within:bg-white">
                <Mail className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Please enter a valid email address",
                    },
                  })}
                  className="ml-3 w-full bg-transparent text-gray-800 placeholder-gray-400 outline-none text-sm"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative flex items-center rounded-xl border border-gray-300 px-3.5 py-3 transition-all duration-200 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 bg-gray-50/50 focus-within:bg-white">
                <Lock className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <input
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  type="password"
                  placeholder="Create a password"
                  className="ml-3 w-full bg-transparent text-gray-800 placeholder-gray-400 outline-none text-sm "
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.password.message}</p>
              )}
            </div>
            

            {/* Terms Checkbox */}
            <div>
              <div className="flex items-start gap-3">
                <input
                  id="agreedToTerms"
                  {...register("agreedToTerms", {
                    required: "You must agree to the terms to proceed",
                  })}
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 accent-blue-600"
                />
                <label htmlFor="agreedToTerms" className="text-xs sm:text-sm text-gray-600 cursor-pointer select-none leading-tight">
                  I agree to the{" "}
                  <span className="font-semibold text-blue-600 hover:underline">
                    Terms of Service
                  </span>{" "}
                  and{" "}
                  <span className="font-semibold text-blue-600 hover:underline">
                    Privacy Policy
                  </span>
                  .
                </label>
              </div>
              {errors.agreedToTerms && (
                <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.agreedToTerms.message}</p>
              )}
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
            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-white font-semibold shadow-lg transition-all duration-200 ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 hover:shadow-blue-500/25 active:scale-[0.99]"
              }`}
            >
              {loading ? (
                <span>Registering...</span>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Already have an account */}
          <p className="mt-8 text-center text-xs sm:text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-bold text-blue-600 hover:text-blue-700 hover:underline"
            >
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
