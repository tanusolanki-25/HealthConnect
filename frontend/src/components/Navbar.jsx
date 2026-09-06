import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { LogOut, Menu, X } from "lucide-react";

// const NAV_LINKS = {
//   patient: [
//     { label: "Dashboard", to: "/patient/dashboard" },
//     { label: "Appointments", to: "/patient/my-appointments" },
//     { label: "Prescriptions", to: "/patient/prescriptions" },
//     { label: "Access Requests", to: "/patient/access-requests" },
//     { label: "Medical Records", to: "/patient/records" },
//   ],
//   doctor: [
//     { label: "Dashboard", to: "/doctor/dashboard" },
//     { label: "Appointments", to: "/doctor/appointments" },
//     { label: "Prescriptions", to: "/doctor/prescriptions" },
//     { label: "Access Requests", to: "/doctor/access-request/sent" }
//   ],
//   hospital: [
//     { label: "Dashboard", to: "/hospital/dashboard" },
//     { label: "Doctors", to: "/hospital/doctors" },
//     { label: "Appointments", to: "/hospital/appointments" }
//   ]
// }

const Navbar = ({ sidebarOpen, setSidebarOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

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
    <nav className="bg-white fixed top-0 left-0 w-full z-50 shadow-sm border-b border-slate-200/80 h-16 flex items-center  overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 w-full flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <img
            src="/favicon.png"
            alt="logo"
            className="w-9 h-9 object-contain"
          />
          <Link
            to="/"
            className="text-xl font-bold text-blue-600 tracking-tight"
          >
            HealthConnect
          </Link>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-6 font-medium">
          {!user ? (
            <>
              <Link to="/" className="hover:text-blue-400">
                Home
              </Link>
              <Link to="/about" className="hover:text-blue-400">
                About
              </Link>
              <Link
                to="/login"
                className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-400 cursor-pointer"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-400 cursor-pointer"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              {user.profileCompleted && (
                <span className="text-slate-700 font-semibold border-l pl-4 capitalize">
                  {user.role}
                </span>
              )}
              <button
                onClick={handleLogout}
                className="hidden md:flex items-center gap-2 bg-blue-600 text-white px-3 py-2 cursor-pointer rounded hover:bg-blue-400"
              >
                <LogOut size={20} />
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-6 pb-4 flex flex-col space-y-4 font-medium bg-white shadow">
          {!user ? (
            <>
              <Link to="/" onClick={() => setIsOpen(false)}>
                Home
              </Link>

              <Link to="/about" onClick={() => setIsOpen(false)}>
                About
              </Link>
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="bg-blue-600 cursor-pointer text-white px-3 py-2 rounded-lg text-center"
              >
                Login
              </Link>

              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="bg-blue-600 cursor-pointer text-white px-3 py-2 rounded-lg text-center"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              {user.profileCompleted &&
                NAV_LINKS[user.role]?.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}

              <span className="border-t pt-3 font-semibold capitalize">
                {user.role}
              </span>

              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="bg-blue-600 cursor-pointer items-center px-3 flex gap-2 py-2 text-white rounded"
              >
                <LogOut size={20} />
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
