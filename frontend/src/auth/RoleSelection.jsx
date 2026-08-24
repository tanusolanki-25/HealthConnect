import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { useState } from "react";
import { Building2, Stethoscope, User, Check, ArrowRight, ShieldCheck, Loader2 } from "lucide-react";

const roles = [
  {
    value: "patient",
    label: "Patient",
    tagline: "Seeking medical care & records",
    description: "Book appointments, view medical records, and connect with doctors & hospitals.",
    icon: User,
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    iconBg: "bg-emerald-100 text-emerald-600",
    activeBorder: "border-emerald-500 bg-emerald-50/40 ring-2 ring-emerald-500/20",
    checkBg: "bg-emerald-600 border-emerald-600"
  },
  {
    value: "doctor",
    label: "Doctor",
    tagline: "Providing care & prescriptions",
    description: "Manage patient appointments, issue digital prescriptions, and track consultations.",
    icon: Stethoscope,
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    iconBg: "bg-blue-100 text-blue-600",
    activeBorder: "border-blue-500 bg-blue-50/40 ring-2 ring-blue-500/20",
    checkBg: "bg-blue-600 border-blue-600"
  },
  {
    value: "hospital",
    label: "Hospital / Clinic",
    tagline: "Managing healthcare facilities",
    description: "Manage affiliated doctors, appointments, and overall hospital operations.",
    icon: Building2,
    badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
    iconBg: "bg-indigo-100 text-indigo-600",
    activeBorder: "border-indigo-500 bg-indigo-50/40 ring-2 ring-indigo-500/20",
    checkBg: "bg-indigo-600 border-indigo-600"
  }
];

export default function RoleSelection() {
  const { setRoleLocally, user } = useAuth();
  const [selectedRole, setSelectedRole] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSelect = async () => {
    if (!selectedRole) {
      toast.error("Please select a role before continuing");
      return;
    }

    setLoading(true);
    try {
      // Send key 'role' expected by the backend controller ({ role })
      await api.patch("/auth/set-role", { role: selectedRole });
      setRoleLocally(selectedRole);
      
      toast.success("Role saved successfully!");

      if (!user?.profileCompleted) {
        navigate(`/${selectedRole}/profile`);
      } else {
        navigate(`/${selectedRole}/dashboard`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not set role");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 py-12">
      <div className="max-w-xl w-full bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-100">
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold tracking-wide uppercase mb-3 border border-blue-100">
            <ShieldCheck size={14} /> Account Setup
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Who are you joining as?
          </h1>
          <p className="text-gray-500 mt-2 text-sm max-w-md mx-auto">
            Select your account type to personalize your experience. This setting cannot be changed later.
          </p>
        </div>

        {/* Roles List */}
        <div className="space-y-4">
          {roles.map((role) => {
            const Icon = role.icon;
            const selected = selectedRole === role.value;

            return (
              <div
                key={role.value}
                onClick={() => setSelectedRole(role.value)}
                className={`group relative cursor-pointer rounded-2xl border-2 p-4 transition-all duration-200 ${
                  selected
                    ? role.activeBorder
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50/50"
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 ${
                      selected ? role.iconBg : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <Icon size={24} />
                  </div>

                  {/* Text Details */}
                  <div className="flex-1 min-w-0 pr-6">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="text-lg font-bold text-gray-900 leading-snug">
                        {role.label}
                      </h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${role.badgeColor}`}>
                        {role.tagline}
                      </span>
                    </div>
                    <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                      {role.description}
                    </p>
                  </div>

                  {/* Selection Radio Circle */}
                  <div className="absolute top-4 right-4">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        selected ? role.checkBg : "border-gray-300 bg-white"
                      }`}
                    >
                      {selected && <Check size={14} className="text-white stroke-[3]" />}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <button
          onClick={handleSelect}
          disabled={loading || !selectedRole}
          className={`w-full mt-8 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-semibold text-white shadow-md transition-all duration-200 ${
            loading || !selectedRole
              ? "bg-gray-300 cursor-not-allowed shadow-none"
              : "bg-blue-600 hover:bg-blue-700 active:scale-[0.99] shadow-blue-500/25"
          }`}
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Saving Role...</span>
            </>
          ) : (
            <>
              <span>Continue to Setup</span>
              <ArrowRight size={18} />
            </>
          )}
        </button>

        {/* Footer Note */}
        <p className="text-center text-xs text-gray-400 mt-4">
          Need help? Contact support if you are unsure which role to select.
        </p>

      </div>
    </div>
  );
}
