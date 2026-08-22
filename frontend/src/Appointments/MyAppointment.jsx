import { useEffect, useState } from "react";
import api from "../api/axios";
import Sidebar from "../dashboard/SideBar";

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    const res = await api.get("/patient/my-appointments");
    setAppointments(res.data.data);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this Appointment?");
    if (!confirmed) return;

    await api.delete(`/patient/appointments/${id}`);
    fetchAppointments();
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-2xl font-semibold text-blue-600 animate-pulse">
          Loading...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50/50 p-6">
    <div className="flex">
      <Sidebar />
      <div className="max-w-5xl mx-auto">
        {appointments.length === 0 ? (
          <div className="bg-white rounded shadow-md p-8 text-center text-gray-500">
            No appointments booked yet.
          </div>
        ) : (
          <div className="grid gap-5">
            {appointments.map((appt) => (
              <div
                key={appt.id}
                className="bg-white rounded shadow-md hover:shadow-lg transition duration-300 border border-gray-200 p-4"
              >
                <h2 className="text-3xl mb-4 pb-4 border-b font-bold text-black">
                  My Appointments
                </h2>
                <div className="flex justify-between items-start flex-wrap gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      Dr. {appt.doctor.name}
                    </h3>

                    <p className="text-blue-600 font-medium mt-1">
                      {appt.doctor.specialization}
                    </p>

                    <p className="text-gray-600 mt-3">
                      📅 {new Date(appt.scheduledAt).toLocaleDateString()}
                    </p>

                    <p className="text-gray-600">
                      🕒{" "}
                      {new Date(appt.scheduledAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  <div className="space-x-4 flex">
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        appt.status === "CONFIRMED"
                          ? "bg-green-100 text-green-700"
                          : appt.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-700"
                            : appt.status === "CANCELLED"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {appt.status}
                    </span>
                    <button
                      onClick={() => handleDelete(appt.id)}
                      className="px-4 py-2 rounded-full text-sm font-semibold bg-blue-400 text-black"
                    >
                      Delete
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
  );
}
