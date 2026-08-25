import {
  LayoutDashboard,
  User,
  FileText,
  Pill,
  Calendar,
  ShieldCheck,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/patient/dashboard" },
  { name: "My Profile", icon: User, path: "/patient/profile" },
  { name: "Medical Records", icon: FileText, path: "/patient/records" },
  { name: "Prescriptions", icon: Pill, path: "/patient/prescriptions" },
  { name: "Appointments", icon: Calendar, path: "/patient/my-appointments" },
  { name: "Shared Access", icon: ShieldCheck, path: "/patient/access-requests" },
];

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      {/* Mobile Hamburger Toggle Button */}
      <div className="md:hidden flex items-center justify-between bg-blue-900 text-white p-4 rounded-xl mb-4">
        <div className="flex items-center gap-2 font-bold text-lg">
          <img src="/favicon.png" alt="logo" className="w-7 h-7" />
          <span>HealthConnect</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg bg-blue-800 hover:bg-blue-700 transition"
        >
          {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Overlay backdrop for mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="md:hidden fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:static top-0 left-0 z-50 h-full md:h-auto w-64 shrink-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
        transition-transform duration-300 bg-gradient-to-b from-blue-950 via-blue-900 to-blue-950 text-white rounded shadow-xl flex flex-col border border-blue-800/50`}
      >
        {/* Header Branding */}
        <div className="p-6 border-b border-blue-800/60 flex items-center gap-3">
          <img src="/favicon.png" alt="logo" className="w-8 h-8 object-contain" />
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">HealthConnect</h1>
            <p className="text-xs text-blue-300 font-medium">Patient Portal</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
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
        </nav>

        {/* Footer Note */}
        <div className="p-4 border-t border-blue-800/60 text-xs text-blue-300 text-center">
          HealthConnect Portal v1.0
        </div>
      </aside>
    </>
  );
}