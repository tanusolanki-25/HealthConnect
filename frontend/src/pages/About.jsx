import hospital from "../assets/hospital.png"
import {
  ShieldCheck,
  Lock,
  FileText,
  UserRoundCheck,
  CheckCircle,
} from "lucide-react";


function About() {
return (
  <section className="p-4 bg-gradient-to-b from-white to-slate-50">
    <div className="max-w-7xl mx-auto">

      {/* Heading */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-slate-900">
          Everything You Need
        </h2>

        <p className="mt-5 text-lg text-gray-600 leading-8">
          A secure healthcare platform that connects patients,
          doctors, hospitals, and medical records through one
          seamless experience.
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid md:grid-cols-2 gap-8">

        {/* Secure Storage */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-lg p-8 hover:-translate-y-2 hover:shadow-2xl transition duration-300">

          <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center shadow-md">
            <ShieldCheck size={30} className="text-white" />
          </div>

          <h3 className="text-2xl font-bold text-slate-900 mt-6">
            Secure Storage
          </h3>

          <p className="text-gray-600 mt-4 leading-8">
            Your medical records are encrypted and securely stored in
            the cloud. Access them anytime while maintaining complete
            privacy and protection.
          </p>

          <div className="mt-8 flex items-center gap-3 text-blue-600 font-medium">
            <CheckCircle size={20} />
            End-to-end encrypted
          </div>

          <div className="mt-3 flex items-center gap-3 text-blue-600 font-medium">
            <CheckCircle size={20} />
            Cloud backup
          </div>

          <div className="mt-3 flex items-center gap-3 text-blue-600 font-medium">
            <CheckCircle size={20} />
            Instant access
          </div>

        </div>

        {/* Doctor Access */}
        <div className="bg-gradient-to-br from-cyan-50 to-blue-100 rounded-3xl border border-cyan-200 shadow-lg p-8 hover:-translate-y-2 hover:shadow-2xl transition duration-300">

          <div className="w-16 h-16 rounded-2xl bg-cyan-600 flex items-center justify-center shadow-md">
            <Lock size={30} className="text-white" />
          </div>

          <h3 className="text-2xl font-bold text-slate-900 mt-6">
            Doctor Access Control
          </h3>

          <p className="text-gray-600 mt-4 leading-8">
            Grant or revoke access to your medical records whenever
            you want. Stay in complete control of who can view your
            healthcare information.
          </p>

          <div className="space-y-4 mt-8">

            <div className="flex items-center gap-3">
              <CheckCircle className="text-green-600" size={20} />
              <span>One-time secure access</span>
            </div>

            <div className="flex items-center gap-3">
              <CheckCircle className="text-green-600" size={20} />
              <span>Recurring specialist reviews</span>
            </div>

            <div className="flex items-center gap-3">
              <CheckCircle className="text-green-600" size={20} />
              <span>Instant permission revoke</span>
            </div>

          </div>

        </div>

      </div>

    </div>
  </section>
)
}

export default About
