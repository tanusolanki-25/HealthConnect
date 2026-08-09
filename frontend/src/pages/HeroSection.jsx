import { Link } from "react-router-dom";
import doctor from "../assets/doctor.png";
import { ShieldCheck, Lock, Play } from "lucide-react";

function HeroSection() {
 return (
  <section className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center">
    <div className="max-w-7xl mx-auto px-6 py-6 grid lg:grid-cols-2 gap-16 items-center">

      {/* Left Content */}
      <div>

        <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-5 py-2 rounded-full font-medium shadow-sm">
          <ShieldCheck size={18} />
          Secure Healthcare Platform
        </div>

        <h1 className="mt-8 text-5xl lg:text-6xl font-extrabold leading-tight text-gray-900">
          Your Health,
          <br />
          <span className="text-blue-600">
            Your Data,
          </span>
          <br />
          One Secure Place.
        </h1>

        <p className="mt-6 text-lg text-gray-600 leading-8 max-w-xl">
          Store, access, and securely share your medical records with
          doctors and hospitals anytime, anywhere. A smarter way to
          manage your healthcare.
        </p>

        <div className="flex flex-wrap gap-4 mt-10">
          <Link
            to="/register"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg transition duration-300"
          >
            Get Started →
          </Link>

          <Link
            to="/login"
            className="border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 rounded-xl font-semibold transition duration-300"
          >
            Login
          </Link>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 gap-5 mt-12">

          <div className="bg-white shadow rounded-2xl p-5">
            <h3 className="text-3xl font-bold text-blue-600">
              100%
            </h3>
            <p className="text-gray-500 mt-1">
              Secure Data
            </p>
          </div>

          <div className="bg-white shadow rounded-2xl p-5">
            <h3 className="text-3xl font-bold text-blue-600">
              24/7
            </h3>
            <p className="text-gray-500 mt-1">
              Record Access
            </p>
          </div>

        </div>

      </div>

      {/* Right Image */}
      <div className="relative flex justify-center">

        {/* Background Blur */}
        <div className="absolute w-80 h-80 bg-blue-300 rounded-full blur-3xl opacity-20"></div>

        <img
          src={doctor}
          alt="Doctor"
          className="relative z-10 w-full max-w-lg rounded-3xl shadow-2xl hover:scale-105 transition duration-500"
        />

      </div>

    </div>
  </section>
)
}

export default HeroSection
