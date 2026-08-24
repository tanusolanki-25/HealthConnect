import {
  LayoutDashboard,
  User,
  FileText,
  Pill,
  Calendar,
  ShieldCheck,
  Siren,
  Settings,
  LogOut,
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
    <aside
      className={`w-72 fixed md:static 
      ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      md:translate-x-0
      transition-transform duration-300 min-h-screen rounded bg-blue-900 text-white flex flex-col`}
    >
      <div className="p-6 border-b border-blue-800">
        <h1 className="text-2xl font-bold">🏥 HealthConnect</h1>
      </div>

      <nav className="flex-1 p-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition ${
                isActive ? "bg-white text-blue-900" : "hover:bg-blue-800"
              }`
            }
          >
            <item.icon size={20} />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-blue-800">
        <button
          className="md:hidden"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          ☰
        </button>
      </div>
    </aside>
  );
}