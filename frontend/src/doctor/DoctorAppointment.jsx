import { useEffect, useState } from "react";
import api from "../api/axios";
import SideBar from "../components/SideBar";
import toast from "react-hot-toast";

export default function DoctorAppointment() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetchAppointment();
  }, []);

  const fetchAppointment = async () => {
    const res = await api.get("/doctor/appointments");
    setAppointments(res.data.data);
  };

  const handleCopyId = (patientId) => {
    navigator.clipboard.writeText(patientId);
    toast.success("Patient ID copied!");
  };

  const handleDelete = async (id) => {
    await api.delete(`/doctor/appointments/${id}`);
    fetchAppointment();
    toast.success("Appointments deleted successfully")
  };

  return (
    <div className="h-[calc(100vh-4rem)] overflow-hidden">
      <div className="flex h-full">
        <SideBar />

        <div className="flex-1 md:ml-64 h-full flex flex-col p-2">
          <h2 className="text-3xl border border-gray-200 rounded p-5 shadow-sm hover:shadow-md transition text-center bg-white mb-2 duration-300 flex-col md:flex-row md:items-center font-bold text-black">
            My Appointments
          </h2>
          <div className="flex-1 bg-white hide-scrollbar overflow-y-auto">
            {appointments.length === 0 ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded p-6 shadow-sm border border-gray-100 animate-pulse flex justify-between items-center"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                    <div className="space-y-2">
                      <div className="h-5 bg-gray-200 rounded w-48"></div>
                      <div className="h-4 bg-gray-100 rounded w-32"></div>
                    </div>
                  </div>
                  <div className="h-8 bg-gray-200 rounded-xl w-24"></div>
                </div>
              ))}
            </div>
          ) : (
              <div className="space-y-3">
                {appointments.map((appt) => (
                   <div
                    key={appt.id}
                    className="bg-white rounded shadow-md p-4">
              <div className="flex justify-between items-center ">
                <h2 className="text-xl font-bold text-slate-800">
                  Name:{" "}
                     {appt.patient.name
                       .split(" ")
                       .map(
                         (word) =>
                          word.charAt(0).toUpperCase() + word.slice(1))
                      .join(" ")}
                </h2>
                 <span
                       className={`px-4 py-2 font-medium ${
                   appt.status === "booked"
                     ? "text-blue-600"
                     : appt.status === "completed"
                       ? " text-green-600"
                       : " text-red-600"
                 }`}
                     >
                       {appt.status}
                     </span>
              </div>

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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="flex gap-2 items-center">
                  <p className="text-gray-500 text-sm">Phone</p>
                  <p className="font-semibold">{appt.patient.phone ? appt.patient.phone : "N/A"}</p>
                </div>

                <div className="flex gap-2 items-center">
                  <p className="text-gray-500 text-sm">Gender :</p>
                  <p className="font-semibold">{appt.patient.gender ? appt.patient.gender : "N/A"}</p>
                </div>
                
                <div className="flex gap-2 items-center">
                  <p className="text-gray-500 text-sm">Allergies:</p>
                  <p className="font-semibold">
                           {appt.patient.allergies
                             ? appt.patient.allergies
                             : "None"}</p>
                </div>

                <div className="flex gap-2 items-center">
                  <p className="text-gray-500 text-sm">Address:</p>
                  <p className="font-semibold">
                      {appt.patient.address ? appt.patient.address : "N/A"}
                  </p>
                </div>

                <div className="flex gap-2 items-center">
                  <p className="font-semibold">📅 {new Date(appt.scheduledAt).toLocaleString()}</p>
                </div>
                
                     <div className="flex flex-col items-end justify-between">

                     <button
                       onClick={() => handleDelete(appt.id)}
                       className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-full text-sm font-medium transition cursor-pointer"
                     >
                       Delete
                     </button>
                   </div>
                 </div>
                 
              </div>

              //       {/* Right Side */}
              //       <div className="flex flex-col items-end justify-between h-24 mt-4 md:mt-0">
              //         <span
              //           className={`px-4 py-2 rounded-full text-sm font-medium ${
              //             appt.status === "booked"
              //               ? "bg-blue-100 text-blue-700"
              //               : appt.status === "completed"
              //                 ? "bg-green-100 text-green-700"
              //                 : "bg-red-100 text-red-700"
              //           }`}
              //         >
              //           {appt.status}
              //         </span>

              //         <button
              //           onClick={() => handleDelete(appt.id)}
              //           className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-full text-sm font-medium transition"
              //         >
              //           Delete
              //         </button>
              //       </div>
              //     </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
