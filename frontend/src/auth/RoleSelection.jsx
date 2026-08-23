import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { useAuth } from "../context/AuthContext"
import api from "../api/axios"
import { useState } from "react";
import { Building2, Stethoscope, User } from "lucide-react";

const roles = [
  { value: "patient", label: "Patient", description: "Manage your health records and appointments", icon: User, },
  { value: "doctor", label: "Doctor", description: "Access patient records and issue prescriptions", icon: Stethoscope, },
  { value: "hospital", label: "Hospital", description: "Manage affiliated doctors and appointments", icon: Building2, }
]

export default function RoleSelection() {
  const { setRoleLocally, user } = useAuth()
  const [selectedRole, setSelectedRole] = useState("")
  const navigate = useNavigate()

  const handleSelect = async () => {
    try {
      await api.patch("/auth/set-role", { selectedRole })
      setRoleLocally(role)
       if (!user.profileCompleted) {
        navigate(`/${user.role}/profile`);
      } else {
        navigate(`/${user.role}/dashboard`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not set role")
    }
  }
 

  return (
    <div>
      <div className="max-w-xl mt-10 mx-auto bg-white rounded-xl p-6 shadow-md">
        <h1 className="text-2xl text-center mb-1 font-semibold">One last thing — who are you?</h1>
        <p className="text-gray-500 text-center mb-6 text-sm">This can't be changed later, so pick carefully.</p>
 

        <div className="space-y-3">
          {roles.map((role) => {
            const Icon = role.icon;
            const selected = selectedRole === role.value;

            return (
              <div
                key={role.value}
                onClick={() => setSelectedRole(role.value)}
                className={`cursor-pointer rounded-xl border transition-all duration-200
                ${
                  selected
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300"
                }`}
              >
                <div className="flex items-center justify-between p-2">
                  <div className="flex items-center gap-5">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center
                    ${
                      selected
                        ? "bg-blue-600 text-white"
                        : "bg-blue-100 text-blue-600"
                    }`}
                    >
                      <Icon size={26} />
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {role.label}
                      </h3>

                      <p className="text-gray-500 mt-1">{role.description}</p>
                    </div>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                  ${selected ? "border-blue-600" : "border-gray-300"}`}
                  >
                    {selected && (
                      <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button 
        onClick={handleSelect}
        className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition">
          Continue
        </button>
      </div>
    </div>
  );
}
