import { useState } from "react";
import Sidebar from "../dashboard/SideBar";
import { ArrowRight, KeyRound, Lock, } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import api from "../api/axios";

function ChangePassword({ sidebarOpen, setSidebarOpen }) {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      api.patch("/auth/change-password", data)
      toast.success("Password changed successfully");
      reset();
    } catch (error) {
      toast.error(error.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-2xl font-semibold text-blue-600 animate-pulse">
          Loading...
        </p>
      </div>
    );

  return (
    <div className="">
      <div className="flex flex-col md:flex-row gap-2  max-w-9xl mx-auto">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>
<div className="flex-1 min-w-0 md:ml-64 overflow-y-auto h-full p-2">          <div className="space-y-2">
            {/* ================= HEADER ================= */}
            <div className="bg-white rounded border border-gray-200/80 p-6 shadow-sm gap-6">
              <div className="flex items-center justify-center gap-3 mb-6">
                <KeyRound className="text-blue-600" size={28} />
                <h2 className="text-2xl font-bold text-gray-800">
                  Change Password
                </h2>
              </div>

              <div className="max-w-lg mx-auto bg-white rounded-xl shadow-md border border-gray-200 p-6">
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="mt-8 space-y-3"
                >
                  {/* Email Field */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Current Password
                    </label>
                    <div className="relative flex items-center rounded-xl border border-gray-300 px-3.5 py-3 transition-all duration-200 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 bg-gray-50/50 focus-within:bg-white">
                      <Lock className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      <input
                        {...register("oldPassword", {
                          required: "Password is required",
                          minLength: {
                            value: 6,
                            message: "Password must be at least 6 characters",
                          },
                        })}
                        type="password"
                        placeholder="Enter a current password"
                        className="ml-3 w-full bg-transparent text-gray-800 placeholder-gray-400 outline-none text-sm "
                      />
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-xs mt-1.5 font-medium">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      New Password
                    </label>
                    <div className="relative flex items-center rounded-xl border border-gray-300 px-3.5 py-3 transition-all duration-200 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 bg-gray-50/50 focus-within:bg-white">
                      <Lock className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      <input
                        {...register("newPassword", {
                          required: "Password is required",
                          minLength: {
                            value: 6,
                            message: "Password must be at least 6 characters",
                          },
                        })}
                        type="password"
                        placeholder="Enter a new password"
                        className="ml-3 w-full bg-transparent text-gray-800 placeholder-gray-400 outline-none text-sm "
                      />
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-xs mt-1.5 font-medium">
                        {errors.password.message}
                      </p>
                    )}
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
                      <span>Updating...</span>
                    ) : (
                      <>
                        <span>Update Password</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;
