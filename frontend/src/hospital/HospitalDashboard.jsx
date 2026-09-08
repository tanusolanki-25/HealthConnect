import {
  Building2,
  Trash2,
  CalendarDays,
  Users,
  ClipboardList,
} from "lucide-react";
import { useEffect, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
import SideBar from "../dashboard/SideBar";

export default function HospitalDashboard({ sidebarOpen, setSidebarOpen }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAppointment, setShowAppointment] = useState(false);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get("/hospital/dashboard");
      setData(res.data.data);
    } catch (err) {
      toast.error("Could not load dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="h-[calc(100vh-4rem)] hide-scrollbar overflow-hidden flex items-center justify-center">
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

  return (
    <div className="h-[calc(100vh-4rem)] overflow-hidden">
      <div className="flex h-full">
        <SideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex-1 min-w-0 md:ml-64 hide-scrollbar overflow-y-auto h-full p-2">
          {/* Header */}
          <div className="space-y-2">
            <div className="bg-white border border-blue-100 rounded-2xl shadow-sm p-6 flex items-center gap-5">
                <div className="w-22 h-22 rounded-full bg-blue-100 backdrop-blur flex items-center justify-center text-3xl font-bold overflow-hidden">
                    {data.fileUrl ? (
                      <img
                        src={data.fileUrl}
                        alt="Doctor"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{data.name?.split(" ")
                    .map((word) => word.slice(0, 1).toUpperCase())
                    .join(" ")}</span>
                    )}
                  </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">
                  {data.name
                    .split(" ")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </h1>
                <div className="flex gap-2">
                <p className="text-slate-500">
                 {data.address
                    .split(" ")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")},
                </p>
                <p className="text-slate-500">
                 {(data.city || "").split(" ")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </p><p className="text-slate-500">
                 • Reg. {(data.registrationNumber || "")}
                </p>
                </div>
              </div>
            </div>

            {/* Statistics */}

            <div className="grid md:grid-cols-5 gap-6 mt-8">
              {[
                {
                  title: "Total Affiliated Doctors",
                  value: 6,
                  icon: Users,
                },
                {
                  title: "Upcoming Appointments",
                  value: 9,
                  icon: CalendarDays,
                },
                {
                  title: "Total Appointments",
                  value: 34,
                  icon: ClipboardList,
                },
                {
                  title: "Total Patients",
                  value: 34,
                  icon: ClipboardList,
                },
                {
                  title: "Total Available Beds",
                  value: 34,
                  icon: ClipboardList,
                },
              ].map((item, index) => {
                const Icon = item.icon;

                return (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-2xl shadow-sm p-6 hover:shadow-lg transition"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-slate-500">{item.title}</p>

                        <h2 className="text-4xl font-bold text-blue-600 mt-3">
                          {item.value}
                        </h2>
                      </div>

                      <div className="bg-blue-100 p-3 rounded-xl">
                        <Icon className="text-blue-600" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Doctors */}

            <div className="bg-white border border-blue-100 rounded-2xl shadow-sm p-6 mt-8">
              <h2 className="text-xl font-semibold text-slate-800">
                Affiliated Doctors
              </h2>

              <hr className="my-5 border-blue-100" />

              {[
                {
                  name: "Dr. Sharma",
                  dept: "Cardiology",
                },
                {
                  name: "Dr. Verma",
                  dept: "Orthopedics",
                },
              ].map((doctor, index) => (
                <div
                  key={index}
                  className={`flex justify-between items-center py-4 ${
                    index !== 1 && "border-b border-slate-200"
                  }`}
                >
                  <div>
                    <h3 className="font-semibold text-lg">{doctor.name}</h3>

                    <p className="text-slate-500">{doctor.dept}</p>
                  </div>

                  <button className="w-12 h-12 rounded-xl bg-red-50 border border-red-200 hover:bg-red-100 flex items-center justify-center">
                    <Trash2 className="text-red-600" />
                  </button>
                </div>
              ))}
            </div>

            {/* Appointments */}

            <div className="bg-white border border-blue-100 rounded-2xl shadow-sm p-6 mt-8">
              <h2 className="text-xl font-semibold">
                Appointments at this Hospital
              </h2>

              <hr className="my-5 border-blue-100" />

              {[
                {
                  patient: "Riya Sharma",
                  doctor: "Dr. Sharma",
                  time: "Aug 10, 10:00 AM",
                },
                {
                  patient: "Priya Nair",
                  doctor: "Dr. Verma",
                  time: "Aug 11, 02:30 PM",
                },
                {
                  patient: "Rahul Singh",
                  doctor: "Dr. Sharma",
                  time: "Aug 12, 11:00 AM",
                },
              ].map((appointment, index) => (
                <div
                  key={index}
                  className={`flex justify-between items-center py-4 ${
                    index !== 2 && "border-b border-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-100 p-3 rounded-xl">
                      <CalendarDays className="text-blue-600" />
                    </div>

                    <div>
                      <h3 className="font-semibold text-lg">
                        {appointment.patient}
                      </h3>

                      <p className="text-blue-600">with {appointment.doctor}</p>

                      <p className="text-slate-500 text-sm">
                        {appointment.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
