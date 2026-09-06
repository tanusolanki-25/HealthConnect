import {
  LayoutDashboard,
  FileText,
  Pill,
  Calendar,
  ShieldCheck,
  Settings,
  ChevronDown,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const menuItems = {
  patient: [
    { name: "Dashboard", icon: LayoutDashboard, path: "/patient/dashboard" },
    { name: "Medical Records", icon: FileText, path: "/patient/records" },
    { name: "Prescriptions", icon: Pill, path: "/patient/prescriptions" },
    { name: "Appointments", icon: Calendar, path: "/patient/my-appointments" },
    {
      name: "Shared Access",
      icon: ShieldCheck,
      path: "/patient/access-requests",
    },
  ],
  doctor: [
    { name: "Dashboard", icon: LayoutDashboard, path: "/doctor/dashboard" },
    {
      name: "Access Requests",
      icon: FileText,
      path: "/doctor/access-request/sent",
    },
    { name: "Prescriptions", icon: Pill, path: "/doctor/prescriptions" },
    { name: "Appointments", icon: Calendar, path: "/doctor/appointments" },
  ],
};

export default function ({ sidebarOpen, setSidebarOpen }) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out");
      navigate("/login");
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  return (
    <>
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="md:hidden fixed inset-0 top-16 bg-slate-900/50 backdrop-blur-sm z-40"
        />
      )}

      <aside
        className={`fixed top-16 md:top-18 left-0 z-40 h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] w-64 shrink-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
        transition-transform duration-300 bg-gradient-to-b from-blue-950 via-blue-900 to-blue-950 text-white rounded shadow-xl flex flex-col border border-blue-800/50 overflow-hidden`}
      >
        {/* Header Branding */}
        <div className="p-5 border-b border-blue-800/60 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-blue-300">
            <LayoutDashboard size={18} />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-white">
              {`${user.role
                .split(" ")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")} Portal`}
            </h1>
            <p className="text-xs text-blue-300 font-medium">Dashboard Menu</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-3.5 space-y-1.5 overflow-y-auto">
          {menuItems[user.role]?.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? "bg-white text-blue-950 shadow-md font-semibold"
                    : "text-blue-100 hover:bg-blue-800/60 hover:text-white"
                }`
              }
            >
              <item.icon size={18} />
              <span>{item.name}</span>
            </NavLink>
          ))}
          <div className="relative">
            <button
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className="flex cursor-pointer items-center gap-2 w-full px-3 py-2 rounded-lg hover:bg-blue-800/60"
            >
              <Settings size={20} />
              <span>Settings</span>
              <ChevronDown
                size={18}
                className={`transition-transform ${
                  isSettingsOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isSettingsOpen && (
              <div className="absolute cursor-pointer right-0 mt-2 w-52 rounded-lg z-50">
                <Link
                  to={`/${user.role}/profile`}
                  className="flex items-center w-full rounded gap-3 px-4 py-2 hover:bg-blue-800/60"
                  onClick={() => setIsSettingsOpen(false)}
                >
                  My Profile
                </Link>

                <Link
                  to={`/${user.role}/change-password`}
                  className="flex items-center rounded gap-3 px-4 py-2 hover:bg-blue-800/60"
                  onClick={() => setIsSettingsOpen(false)}
                >
                  Change Password
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* Footer Note */}
        <div className="p-3 border-t border-blue-800/60 text-[11px] text-blue-300/80 text-center">
          <div className="md:hidden p-3 border-t border-blue-800/60">
            <button
              onClick={handleLogout}
              className="w-full cursor-pointer flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
          HealthConnect Portal v1.0
        </div>
      </aside>
    </>
  );
}
