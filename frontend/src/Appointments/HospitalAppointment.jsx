import { useEffect, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
import SideBar from "../dashboard/SideBar";

export default function HospitalAppointment({ sidebarOpen, setSidebarOpen }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    fetchAppointment();
  }, [filterStatus]);

  const fetchAppointment = async () => {
    try {
      setLoading(true);
      const url = filterStatus
        ? `/hospital/appointments?status=${filterStatus}`
        : "/hospital/appointments";
      const res = await api.get(url);
      setAppointments(res.data.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await api.patch(`/hospital/appointments/${id}/status`, { status });
      toast.success(`Appointment status updated to ${status}`);
      fetchAppointment();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update appointment status");
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] overflow-hidden">
      <div className="flex h-full">
        <SideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <div className="flex-1 md:ml-64 h-full flex flex-col p-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border border-gray-200 rounded p-4 shadow-sm bg-white mb-2 gap-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-black">
              Hospital Appointments
            </h2>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-500">Status:</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-white cursor-pointer outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Statuses</option>
                <option value="booked">Booked</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="flex-1 hide-scrollbar overflow-y-auto rounded">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-lg font-medium text-blue-600 animate-pulse">Loading appointments...</p>
              </div>
            ) : appointments.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                  📅
                </div>
                <p className="text-gray-500 text-lg">No appointments found.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {appointments.map((appt) => (
                  <div
                    key={appt.id}
                    className="bg-white border border-gray-200 rounded shadow-sm hover:shadow-md transition p-5 space-y-4"
                  >
                    {/* Header: Patient Name & Status */}
                    <div className="flex flex-wrap justify-between items-center gap-2 border-b border-gray-100 pb-3">
                      <div>
                        <h3 className="text-xl font-bold text-slate-800">
                          {appt.patient?.name
                            ? appt.patient.name
                                .split(" ")
                                .map(
                                  (word) =>
                                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                                )
                                .join(" ")
                            : "N/A"}
                        </h3>
                        <p className="text-sm text-blue-600 font-medium mt-0.5">
                          Doctor: Dr. {appt.doctor?.name || "N/A"}
                          {appt.doctor?.specialization ? ` (${appt.doctor.specialization})` : ""}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={appt.status}
                          onChange={(e) => handleStatusChange(appt.id, e.target.value)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold border cursor-pointer outline-none transition ${
                            appt.status === "booked"
                              ? "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                              : appt.status === "completed"
                              ? "bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                              : "bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                          }`}
                        >
                          <option value="booked">Booked</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>

                    {/* Patient ID */}
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 bg-slate-50 p-2.5 rounded-lg text-sm">
                      <div className="flex gap-2 items-center min-w-0">
                        <span className="text-gray-500 shrink-0">Patient ID:</span>
                        <span className="font-mono font-medium text-gray-800 truncate">
                          {appt.patientId}
                        </span>
                      </div>

                      <button
                        onClick={() => handleCopyId(appt.patientId)}
                        className="text-blue-600 hover:text-blue-800 underline text-xs font-semibold cursor-pointer self-start sm:self-auto"
                      >
                        Copy ID
                      </button>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                      <div>
                        <span className="text-gray-500 block text-xs">Phone</span>
                        <span className="font-semibold text-gray-800">
                          {appt.patient?.phone || "N/A"}
                        </span>
                      </div>

                      <div>
                        <span className="text-gray-500 block text-xs">Gender</span>
                        <span className="font-semibold text-gray-800">
                          {appt.patient?.gender || "N/A"}
                        </span>
                      </div>

                      <div>
                        <span className="text-gray-500 block text-xs">Scheduled Time</span>
                        <span className="font-semibold text-gray-800">
                          📅 {new Date(appt.scheduledAt).toLocaleString()}
                        </span>
                      </div>

                      <div>
                        <span className="text-gray-500 block text-xs">Allergies</span>
                        <span className="font-semibold text-gray-800">
                          {appt.patient?.allergies || "None"}
                        </span>
                      </div>

                      <div className="sm:col-span-2">
                        <span className="text-gray-500 block text-xs">Address</span>
                        <span className="font-semibold text-gray-800">
                          {appt.patient?.address || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}