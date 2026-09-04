import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Send, Check, X } from "lucide-react";
import api from "../api/axios";
import SideBar from "./SideBar";

export default function DoctorDashboard({ sidebarOpen, setSidebarOpen }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [patientId, setPatientId] = useState("");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get("/doctor/dashboard");
      setData(res.data.data);
    } catch (err) {
      toast.error("Could not load dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAccess = async (e) => {
    e.preventDefault();

    if (!patientId.trim()) {
      toast.error("Please enter a valid Patient ID");
      return;
    }
    try {
      await api.post("/doctor/access-request", { patientId: patientId.trim() });
      toast.success("Access request sent");
      setPatientId("");
      fetchDashboard();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not send request");
    }
  };

  const handleAppointmentStatus = async (id, status) => {
    try {
      await api.patch(`/doctor/appointments/${id}/status`, { status });
      toast.success(`Marked as ${status}`);
      fetchDashboard();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update status");
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

  if (!data)
    return (
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

  const pendingSentRequests = data.permissions.filter(
    (p) => p.status === "pending",
  );
  const upcomingAppointments = data.appointments.filter(
    (a) => a.status === "booked",
  );
  return (
    <div className="h-[calc(100vh-4rem)] overflow-hidden">
      <div className="flex h-full">
        <SideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <div className="flex-1 min-w-0 md:ml-64 hide-scrollbar overflow-y-auto h-full p-2">
          <div className="space-y-4">
            {/* Header */}
            <div className="bg-white border-gray-100 text-blue-700 rounded p-4 shadow-sm border">
              <div className="flex items-center justify-between flex-wrap gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-20 h-20 rounded-full bg-blue-100 backdrop-blur flex items-center justify-center text-3xl font-bold">
                    {data.name?.slice(0, 2).toUpperCase()}
                  </div>

                  <div>
                    <h1 className="text-3xl text-black font-bold">
                      Dr.{" "}
                      {data.name
                        .split(" ")
                        .map(
                          (word) =>
                            word.charAt(0).toUpperCase() + word.slice(1),
                        )
                        .join(" ")}
                    </h1>

                    <p className="text-black mt-1">
                      {data.specialization
                        .split(" ")
                        .map(
                          (word) =>
                            word.charAt(0).toUpperCase() + word.slice(1),
                        )
                        .join(" ")}
                    </p>

                    {data.hospital && (
                      <p className="text-sm text-blue-200">
                        {data.hospital.name}
                      </p>
                    )}
                  </div>
                </div>

                <div className="bg-blue-100 rounded-xl p-3">
                  <p className="text-sm text-blue-700">Welcome Back 👋</p>
                  <h2 className="text-2xl font-semibold">Doctor Dashboard</h2>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <StatCard
                label="Upcoming Appointments"
                value={upcomingAppointments.length}
                color="blue"
              />

              <StatCard
                label="Pending Requests"
                value={pendingSentRequests.length}
                color="blue"
              />

              <StatCard
                label="Prescriptions"
                value={data.prescriptions.length}
                color="blue"
              />
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Request Access */}

              <Section title="Request Patient Access">
                <form onSubmit={handleRequestAccess} className="flex gap-3">
                  <input
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                    placeholder="Enter Patient ID..."
                    className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none "
                  />

                  <button
                    type="submit"
                    disabled={!patientId.trim()}
                    className="bg-blue-600 hover:bg-blue-700 transition text-white px-6 rounded-xl flex items-center gap-2 disabled:bg-blue-500"
                  >
                    <Send size={18} />
                    Send
                  </button>
                </form>
              </Section>

              {/* Access Requests */}

              <Section title="Sent Access Requests">
                {data.permissions.length === 0 && (
                  <EmptyText text="No Requests Yet" />
                )}

                <div className="space-y-4">
                  {data.permissions.map((req) => (
                    <div
                      key={req.id}
                      className="flex justify-between items-center bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition"
                    >
                      <div>
                        <h3 className="font-semibold">
                          {req.patient.name
                            .split(" ")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1),
                            )
                            .join(" ")}
                        </h3>

                        <p className="text-sm text-gray-500">Patient</p>
                      </div>

                      <StatusBadge status={req.status} />
                    </div>
                  ))}
                </div>
              </Section>
            </div>

            {/* Appointments */}

            <Section title="Upcoming Appointments">
              {upcomingAppointments.length === 0 && (
                <EmptyText text="No Upcoming Appointments" />
              )}

              <div className="space-y-4">
                {upcomingAppointments.map((appt) => (
                  <div
                    key={appt.id}
                    className="flex justify-between items-center rounded-xl bg-slate-50 p-4 hover:bg-slate-100"
                  >
                    <div>
                      <h3 className="font-semibold">
                        {appt.patient.name
                          .split(" ")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1),
                          )
                          .join(" ")}
                      </h3>

                      <p className="text-sm text-gray-500">
                        {new Date(appt.scheduledAt).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() =>
                          handleAppointmentStatus(appt.id, "completed")
                        }
                        className="w-11 h-11 rounded-full bg-green-100 hover:bg-green-200 flex justify-center items-center"
                      >
                        <Check className="text-green-600" />
                      </button>

                      <button
                        onClick={() =>
                          handleAppointmentStatus(appt.id, "cancelled")
                        }
                        className="w-11 h-11 rounded-full bg-red-100 hover:bg-red-200 flex justify-center items-center"
                      >
                        <X className="text-red-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            {/* Prescriptions */}

            <Section title="Recent Prescriptions">
              {data.prescriptions.length === 0 && (
                <EmptyText text="No Prescriptions" />
              )}

              <div className="space-y-4">
                {data.prescriptions.slice(0, 5).map((p) => (
                  <div
                    key={p.id}
                    className="rounded bg-slate-50 p-4 hover:bg-slate-100"
                  >
                    <h3 className="font-semibold">
                      {p.patient.name
                        .split(" ")
                        .map(
                          (word) =>
                            word.charAt(0).toUpperCase() + word.slice(1),
                        )
                        .join(" ")}
                    </h3>

                    <p className="text-sm mt-1">{p.medicines}</p>

                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(p.issuedDate).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </Section>
          </div>
        </div>
      </div>
    </div>
  );
}
function StatCard({ label, value, color }) {
  const colors = {
    blue: "from-blue-500 to-indigo-600",
  };

  return (
    <div
      className={`bg-gradient-to-r ${colors[color]} text-white rounded-xl shadow-lg p-5`}
    >
      <p className="text-sm opacity-90">{label}</p>

      <h2 className="text-4xl font-bold mt-2">{value}</h2>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-white rounded shadow-lg p-6">
      <h2 className="text-xl font-bold mb-5">{title}</h2>
       <div className="space-y-2 hide-scrollbar overflow-scroll h-30">
        {children}
      </div>
    </div>
  );
}

function EmptyText({ text }) {
  return <div className="py-8 text-center text-gray-400">{text}</div>;
}
function StatusBadge({ status }) {
  const styles = {
    pending: "bg-yellow-100 text-yellow-700",

    approved: "bg-green-100 text-green-700",

    denied: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`px-4 py-2 rounded-full text-sm font-semibold ${styles[status]}`}
    >
      {status}
    </span>
  );
}
