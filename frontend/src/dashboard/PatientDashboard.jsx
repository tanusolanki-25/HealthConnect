import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Calendar, Upload, Check, X } from "lucide-react";
import api from "../api/axios";
import { Link } from "react-router-dom";
import UploadRecord from "../records/UploadRecords";
import BookAppointment from "../Appointments/BookAppointment";

export default function PatientDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAppointment, setShowAppointment] = useState(false);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get("/patient/dashboard");
      setData(res.data.data);
    } catch (err) {
      toast.error("Could not load dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyId = ()=>{
    navigator.clipboard.writeText(data.id)
    alert("Patient ID copied!")
  }

  const handleApprove = async (id) => {
    try {
      await api.patch(`/patient/access-requests/${id}/approve`);
      toast.success("Access approved");
      fetchDashboard(); // refresh so the list reflects the new status
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not approve");
    }
  };

  const handleDeny = async (id) => {
    try {
      await api.patch(`/patient/access-requests/${id}/deny`);
      toast.success("Access denied");
      fetchDashboard();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not deny");
    }
  };

  if (loading)
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-2xl font-semibold text-blue-600 animate-pulse">
        Loading...
      </p>
    </div>
  );
  if (!data) return(
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="text-5xl mb-4">⚠️</div>
      <h2 className="text-2xl font-bold text-red-600">
        Could not load dashboard
      </h2>
      <p className="mt-2 text-gray-600">
        Something went wrong. Please refresh the page or try again later.
      </p>
    </div>
  </div>
  );

  const upcomingAppointments = data.appointments.filter(
    (a) => a.status === "booked",
  );

 return (
  <div className="min-h-screen bg-gray-50/50 p-4">
    <div className="max-w-7xl mx-auto space-y-6">

      {/* ================= HEADER ================= */}
      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 flex flex-col lg:flex-row justify-between lg:items-center gap-6">

        {/* Profile */}
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            {data.name?.slice(0, 2).toUpperCase()}
          </div>

          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              {data.name
                .split(" ")
                .map(
                  (word) =>
                    word.charAt(0).toUpperCase() + word.slice(1)
                )
                .join(" ")}
            </h2>

            <p className="text-gray-500 mt-1">
              {data.bloodGroup &&
                `Blood Group : ${data.bloodGroup}`}
              {data.contact && ` • ${data.contact}`}
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-3">

          <button
            onClick={() => setShowAppointment(true)}
            className="flex items-center gap-2 bg-white border border-blue-200 hover:bg-blue-50 px-5 py-3 rounded-xl transition shadow-sm font-medium"
          >
            <Calendar size={18} />
            Book Appointment
          </button>

          <BookAppointment
            showAppointment={showAppointment}
            setShowAppointment={setShowAppointment}
          />

          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl transition shadow-md font-medium"
          >
            <Upload size={18} />
            Upload Record
          </button>

          <UploadRecord
            showUploadModal={showUploadModal}
            setShowUploadModal={setShowUploadModal}
          />
        </div>
      </div>

      {/* ================= PATIENT ID ================= */}

      <div className="bg-white rounded-2xl shadow border border-gray-100 p-5 flex flex-col md:flex-row justify-between md:items-center gap-4">

        <div>
          <p className="text-sm text-gray-500">
            Patient ID
          </p>

          <p className="font-semibold text-gray-800 break-all">
            {data.id}
          </p>
        </div>

        <button
          onClick={handleCopyId}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl transition"
        >
          Copy ID
        </button>
      </div>

      {/* ================= STATS ================= */}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">

        <StatCard
          label="Appointments"
          value={upcomingAppointments.length}
          color="blue"
        />

        <StatCard
          label="Pending Requests"
          value={data.permissions.length}
          color="yellow"
        />

        <StatCard
          label="Prescriptions"
          value={data.prescriptions.length}
          color="green"
        />

        <StatCard
          label="Medical Records"
          value={data.records.length}
          color="purple"
        />

      </div>

      {/* ================= APPOINTMENTS ================= */}

      <Section title="Upcoming Appointments">

        {upcomingAppointments.length === 0 ? (
          <EmptyText text="No upcoming appointments." />
        ) : (
          upcomingAppointments.map((appt, i) => (
            <div
              key={i}
              className="flex justify-between items-center border-b last:border-0 py-4"
            >
              <div>
                <h3 className="font-semibold text-gray-800">
                  Dr. {appt.doctor.name}
                </h3>

                <p className="text-gray-500 text-sm">
                  {appt.doctor.specialization}
                </p>
              </div>

              <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                {new Date(
                  appt.scheduledAt
                ).toLocaleString()}
              </span>
            </div>
          ))
        )}

      </Section>

      {/* ================= PRESCRIPTION + RECORD ================= */}

      <div className="grid lg:grid-cols-2 gap-6">

        <Section title="Recent Prescriptions">

          {data.prescriptions.length === 0 ? (
            <EmptyText text="No prescriptions available." />
          ) : (
            data.prescriptions.slice(0, 3).map((p, i) => (
              <div
                key={i}
                className="border-b last:border-0 py-4"
              >
                <h3 className="font-semibold text-gray-800">
                  {p.medicines}
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Dr. {p.doctor.name}
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  {new Date(
                    p.issuedDate
                  ).toLocaleDateString()}
                </p>
              </div>
            ))
          )}

        </Section>

        <Section title="Recent Records">

          {data.records.length === 0 ? (
            <EmptyText text="No records uploaded." />
          ) : (
            data.records.slice(0, 3).map((r, i) => (
              <div
                key={i}
                className="border-b last:border-0 py-4"
              >
                <h3 className="font-semibold text-gray-800">
                  {r.recordType}
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  {r.doctor?.name
                    ? `Dr. ${r.doctor.name}`
                    : r.hospital?.name || "Self Uploaded"}
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  {new Date(
                    r.uploadDate
                  ).toLocaleDateString()}
                </p>
              </div>
            ))
          )}

        </Section>

      </div>

    </div>
  </div>
);
}

function StatCard({ label, value, color }) {
  const colors = {
    blue: "from-blue-500 to-cyan-500",
    green: "from-green-500 to-emerald-500",
    yellow: "from-yellow-500 to-orange-500",
    purple: "from-purple-500 to-pink-500",
  };

  return (
    <div
      className={`bg-gradient-to-r ${colors[color]} rounded-2xl p-5 text-white shadow-lg`}
    >
      <p className="text-sm opacity-90">{label}</p>

      <h2 className="text-3xl font-bold mt-2">
        {value}
      </h2>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-2xl shadow border border-gray-100 p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-5">
        {title}
      </h2>

      <div className="space-y-2">
        {children}
      </div>
    </div>
  );
}


function EmptyText({ text }) {
  return (
    <div className="py-10 text-center text-gray-400">
      {text}
    </div>
  );
}
