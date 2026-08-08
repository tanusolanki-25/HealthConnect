import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast"
import { useAuth } from "../context/AuthContext";

const NAV_LINKS = {
  patient: [
    { label: "Dashboard", to: "/patient/dashboard" },
    { label: "Appointments", to: "/patient/my-appointments" },
    { label: "Records", to: "/patient/records" },
    { label: "Prescriptions", to: "/patient/prescriptions" },
    { label: "Access Requests", to: "/patient/access-requests" }
  ],
  doctor: [
    { label: "Dashboard", to: "/doctor/dashboard" },
    { label: "Appointments", to: "/doctor/appointments" },
    { label: "Prescriptions", to: "/doctor/prescriptions" },
    { label: "Access Requests", to: "/doctor/access-request/sent" }
  ],
  hospital: [
    { label: "Dashboard", to: "/hospital/dashboard" },
    { label: "Doctors", to: "/hospital/doctors" },
    { label: "Appointments", to: "/hospital/appointments" }
  ]
}
 
const Navbar = () => {
  const {user, logout} = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
      toast.success("Logged out")
      navigate("/login")
    } catch (err) {
      toast.error("Logout failed")
    }
  }

  return (
   <nav className="fixed top-0 left-0 w-full bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-200 z-50">
  <div className="max-w-7xl mx-auto flex items-center justify-between h-20 px-6">

        <div className="flex space-x-3 items-center">
        <img src="/favicon.png" alt="logo" className="w-12 h-12" />
        <Link to="/" className="text-xl font-bold text-blue-600">
          HealthConnect
        </Link>
        </div>
        {/* Links */}
        <div className="space-x-6 font-medium">
          <Link to="/" className="hover:text-blue-400">
            Home
          </Link>

          <Link to="/about" className="hover:text-blue-400">
            About
          </Link>
          {!user ? 
          (<>
            <Link
            to="/login"
            className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-400">
             Login
            </Link> 
            <Link
            to="/register"
            className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-400">
            Sign Up
            </Link> 
          </>)
        :(<>
           {NAV_LINKS[user.role]?.map((link) => (
            <Link key={link.to} to={link.to} className="hover:text-blue-400">
              {link.label}
            </Link>
           ))}
            <span className=" text-black border-l pl-4 ">{user.role}</span>
          <button
            onClick={handleLogout}
            className="bg-blue-600 text-white px-2 py-2 rounded-lg hover:bg-blue-400">
            Logout
          </button>
          </>
        )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;