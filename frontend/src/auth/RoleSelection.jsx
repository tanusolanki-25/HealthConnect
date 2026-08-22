import {
  User,
  Stethoscope,
  Building2,
  Microscope,
  UserCheck,
  ShieldCheck,
  CheckCircle2,
  HeartPulse,
} from "lucide-react";
import { useState } from "react";

const roles = [
  {
    id: "patient",
    title: "Patient",
    description: "Manage your health records and appointments.",
    icon: User,
  },
  {
    id: "doctor",
    title: "Doctor",
    description: "Access patient data and consult remotely.",
    icon: Stethoscope,
  },
  {
    id: "hospital",
    title: "Hospital",
    description: "Coordinate staff and facility operations.",
    icon: Building2,
  },
];

export default function RoleSelection() {
  const [selectedRole, setSelectedRole] = useState("patient");

  return (
    <div>
      <div className="max-w-xl mt-10 mx-auto bg-white rounded-xl p-6 shadow-md">
        <p className="text-gray-500 mb-6">
          Select your role to get started with your professional or personal
          healthcare journey.
        </p>

        <div className="space-y-3">
          {roles.map((role) => {
            const Icon = role.icon;
            const selected = selectedRole === role.id;

            return (
              <div
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
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
                        {role.title}
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

        <button className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition">
          Continue
        </button>
      </div>
    </div>
  );
}
