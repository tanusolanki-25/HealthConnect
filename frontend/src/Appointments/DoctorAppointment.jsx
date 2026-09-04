import { useEffect, useState } from "react";
import api from "../api/axios";
import SideBar from "../dashboard/SideBar";

export default function DoctorAppointment() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetchAppointment();
  }, []);

  const fetchAppointment = async () => {
    const res = await api.get("/doctor/appointments");
    setAppointments(res.data.data);
  };

  const handleDelete = async (id) => {
    await api.delete(`/doctor/appointments/${id}`);
    fetchAppointment();
  };

  return (
    <div className="h-[calc(100vh-4rem)] overflow-hidden">
      <div className="flex h-full">
        <SideBar />

        <div className="flex-1 md:ml-64 h-full flex flex-col p-2">
          <div className="flex-1 bg-white hide-scrollbar overflow-y-auto">
            {appointments.length === 0 ? (
              <div className="text-center py-12">
                 <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                  📅
                </div>
                <p className="text-gray-500 text-lg">No appointments yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.map((appt) => (
                  <div
                    key={appt.id}
                    className="border border-gray-200 rounded p-5 shadow-sm hover:shadow-md transition duration-300 flex flex-col md:flex-row md:items-center md:justify-between"
                  >
                    <h2 className="text-3xl mb-4 pb-4 border-b font-bold text-black">
                      My Appointments
                    </h2>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">
                        {appt.patient.name
                          .split(" ")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1),
                          )
                          .join(" ")}
                      </h2>

                      <p className="text-sm text-gray-500 mt-1">
                        📅 {new Date(appt.scheduledAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="gap-2 flex">
                      <span
                        className={`mt-3 md:mt-0 px-4 py-2 rounded-full text-sm font-medium ${
                          appt.status === "booked"
                            ? "bg-blue-100 text-blue-700"
                            : appt.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {appt.status}
                      </span>
                      <button
                        onClick={() => handleDelete(appt.id)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium"
                      >
                        Delete
                      </button>
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
