import { useEffect, useState } from "react";
import api from "../api/axios";
import Sidebar from "../dashboard/SideBar";
import toast from "react-hot-toast";
import {
  Calendar,
  Clock,
  Stethoscope,
  Trash2,
  CalendarCheck,
  Loader2,
} from "lucide-react";

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await api.get("/patient/my-appointments");
      setAppointments(res.data.data || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Could not fetch appointments",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel/delete this appointment?",
    );
    if (!confirmed) return;

    try {
      await api.delete(`/patient/appointments/${id}`);
      toast.success("Appointment deleted successfully");
      fetchAppointments();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Could not delete appointment",
      );
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] overflow-hidden">
      <div className="flex h-full">
        <Sidebar />

        <div className="flex-1 md:ml-64 h-full flex flex-col p-2">
          {/* Header */}
          <div className="bg-white rounded p-6 shadow-sm border border-gray-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <CalendarCheck className="w-6 h-6" />
                </span>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                  My Appointments
                </h1>
              </div>
              <p className="text-gray-500 text-sm mt-1">
                View and manage your scheduled doctor consultations
              </p>
            </div>

            <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl text-xs font-semibold self-start sm:self-auto border border-blue-100">
              Total: {appointments.length}
            </div>
          </div>
          {/* Appointments List */}
          <div className="flex-1 hide-scrollbar overflow-y-auto mt-2">
            {loading ? (
              <div className="bg-white rounded p-12 text-center border border-gray-100 shadow-sm">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
                <p className="text-gray-500 text-sm font-medium">
                  Loading appointments...
                </p>
              </div>
            ) : appointments.length === 0 ? (
              <div className="bg-white rounded p-12 text-center border border-gray-100 shadow-sm">
                <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                  📅
                </div>
                <h3 className="text-lg font-bold text-gray-800">
                  No Appointments Booked
                </h3>
                <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">
                  You haven't scheduled any doctor appointments yet. You can
                  book an appointment directly from your dashboard.
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {appointments.map((appt) => (
                  <div
                    key={appt.id}
                    className="bg-white rounded shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200/80 p-5 sm:p-6"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      {/* Doctor Details */}
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                          <Stethoscope className="w-6 h-6" />
                        </div>

                        <div>
                          <h3 className="text-lg font-bold text-gray-900">
                            Dr. {appt.doctor?.name}
                          </h3>

                          <p className="text-blue-600 text-sm font-semibold mt-0.5">
                            {appt.doctor?.specialization}
                          </p>

                          <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-gray-500">
                            <span className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-200 font-medium">
                              <Calendar className="w-3.5 h-3.5 text-gray-400" />
                              {new Date(appt.scheduledAt).toLocaleDateString(
                                undefined,
                                {
                                  weekday: "short",
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                },
                              )}
                            </span>

                            <span className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-200 font-medium">
                              <Clock className="w-3.5 h-3.5 text-gray-400" />
                              {new Date(appt.scheduledAt).toLocaleTimeString(
                                [],
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Status & Actions */}
                      <div className="flex items-center gap-3 self-end sm:self-center pt-2 sm:pt-0">
                        <span
                          className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                            appt.status === "booked" ||
                            appt.status === "CONFIRMED"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : appt.status === "PENDING"
                                ? "bg-amber-50 text-amber-700 border border-amber-200"
                                : "bg-gray-100 text-gray-700 border border-gray-200"
                          }`}
                        >
                          {appt.status}
                        </span>

                        <button
                          onClick={() => handleDelete(appt.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 transition border border-rose-100"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Cancel</span>
                        </button>
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
