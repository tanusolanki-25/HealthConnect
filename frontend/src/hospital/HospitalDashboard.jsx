import {
  Building2,
  Trash2,
  CalendarDays,
  Users,
  ClipboardList,
  Bed,
  Phone,
  Mail,
  MapPin,
  Clock,
  ExternalLink,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";
import SideBar from "../dashboard/SideBar";

export default function HospitalDashboard({ sidebarOpen, setSidebarOpen }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get("/hospital/dashboard");
      setData(res.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not load dashboard");
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <div className="h-[calc(100vh-4rem)] hide-scrollbar overflow-hidden flex items-center justify-center">
        <p className="text-2xl font-semibold text-blue-600 animate-pulse">
          Loading hospital dashboard...
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 max-w-md">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-600">
            Could not load dashboard
          </h2>
          <p className="mt-2 text-gray-600 mb-4">
            Could not retrieve hospital dashboard information. Please refresh or try again later.
          </p>
          <button
            onClick={fetchDashboard}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const doctors = data.doctors || [];
  const appointments = data.appointments || [];
  const upcomingAppointments = appointments.filter(
    (a) => a.status === "booked"
  );
  const totalPatients = new Set(
    appointments.map((a) => a.patientId || a.patient?.name).filter(Boolean)
  ).size;

  const statCards = [
    {
      title: "Affiliated Doctors",
      value: doctors.length,
      icon: Users,
      color: "blue",
      link: "/hospital/doctors",
    },
    {
      title: "Upcoming Appointments",
      value: upcomingAppointments.length,
      icon: CalendarDays,
      color: "cyan",
      link: "/hospital/appointments",
    },
    {
      title: "Total Appointments",
      value: appointments.length,
      icon: ClipboardList,
      color: "indigo",
      link: "/hospital/appointments",
    },
    {
      title: "Unique Patients",
      value: totalPatients,
      icon: ShieldCheck,
      color: "teal",
      link: "/hospital/appointments",
    },
    {
      title: "Total Available Beds",
      value: data.beds !== null && data.beds !== undefined ? data.beds : "N/A",
      icon: Bed,
      color: "amber",
      link: null,
    },
  ];

  return (
    <div className="h-[calc(100vh-4rem)] overflow-hidden">
      <div className="flex h-full">
        <SideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <div className="flex-1 min-w-0 md:ml-64 hide-scrollbar overflow-y-auto h-full p-2 sm:p-2 space-y-3">
          {/* Hospital Profile Card */}
          <div className="bg-white border border-blue-100 rounded shadow-sm p-5 sm:p-6 transition hover:shadow-md">
            <div className="flex flex-col md:flex-row gap-5 items-start md:items-center justify-between">
              <div className="flex items-center gap-4 sm:gap-5">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-3xl font-bold overflow-hidden shadow-inner shrink-0">
                  {data.logoUrl ? (
                    <img
                      src={data.logoUrl}
                      alt={data.name || "Hospital"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>
                      {data.name
                        ? data.name
                            .split(" ")
                            .map((word) => word.charAt(0).toUpperCase())
                            .slice(0, 2)
                            .join("")
                        : "H"}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
                      {data.name
                        ? data.name
                            .split(" ")
                            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(" ")
                        : "Hospital Dashboard"}
                    </h1>
                    {data.type && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                        {data.type}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin size={14} className="text-slate-400" />
                      {data.address}
                      {data.city ? `, ${data.city}` : ""}
                      {data.state ? `, ${data.state}` : ""}
                    </span>

                    {data.registrationNumber && (
                      <span className="border-l border-slate-200 pl-3">
                        Reg: <strong className="text-slate-700">{data.registrationNumber}</strong>
                      </span>
                    )}
                  </div>

                  {/* Hours & Contact Tags */}
                  <div className="flex flex-wrap gap-2 pt-1 text-xs">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg font-medium">
                      <Clock size={12} />
                      {data.is24Hours
                        ? "Open 24/7"
                        : data.openingTime && data.closingTime
                        ? `${data.openingTime} - ${data.closingTime}`
                        : "Hours: Contact Hospital"}
                    </span>

                    {data.phone && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-50 text-slate-600 border border-slate-200 rounded-lg font-medium">
                        <Phone size={12} />
                        {data.phone}
                      </span>
                    )}

                    {data.emergencyPhone && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-50 text-red-600 border border-red-100 rounded-lg font-medium">
                        <Phone size={12} />
                        Emergency: {data.emergencyPhone}
                      </span>
                    )}

                    {data.email && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-50 text-slate-600 border border-slate-200 rounded-lg font-medium">
                        <Mail size={12} />
                        {data.email}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-stretch md:self-auto justify-end">
                <Link
                  to="/hospital/doctors"
                  className="px-4 py-2 text-xs sm:text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition border border-blue-200 flex items-center gap-1.5"
                >
                  <Users size={16} />
                  <span>Doctors</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {statCards.map((item, index) => {
              const Icon = item.icon;
              const cardContent = (
                <div className="bg-gradient-to-br from-blue-50/70 via-white to-white border border-blue-100 rounded-xl shadow-sm p-5 hover:shadow-md hover:border-blue-200 transition h-full flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <p className="text-slate-500 text-xs sm:text-sm font-medium">
                      {item.title}
                    </p>
                    <div className="bg-blue-100/70 p-2.5 rounded-xl text-blue-600">
                      <Icon size={20} />
                    </div>
                  </div>
                  <div className="mt-3">
                    <h2 className="text-3xl font-bold text-slate-800">
                      {item.value}
                    </h2>
                  </div>
                </div>
              );

              return item.link ? (
                <Link key={index} to={item.link}>
                  {cardContent}
                </Link>
              ) : (
                <div key={index}>{cardContent}</div>
              );
            })}
          </div>

          {/* Doctors & Appointments Two-Column Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            {/* Affiliated Doctors */}
            <div className="bg-white border border-blue-100 rounded shadow-sm p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Users className="text-blue-600" size={20} />
                    <h2 className="text-lg font-bold text-slate-800">
                      Affiliated Doctors ({doctors.length})
                    </h2>
                  </div>
                  <Link
                    to="/hospital/doctors"
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition"
                  >
                    View All <ArrowRight size={14} />
                  </Link>
                </div>

                {doctors.length === 0 ? (
                  <div className="text-center py-10">
                    <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-3 text-xl">
                      👨‍⚕️
                    </div>
                    <p className="text-slate-500 text-sm font-medium">
                      No affiliated doctors yet.
                    </p>
                    <p className="text-slate-400 text-xs mt-1">
                      Doctors can select this hospital when registering or updating their profile.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 mt-2">
                    {doctors.slice(0, 5).map((doc) => (
                      <div
                        key={doc.id}
                        className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50/60 px-2 rounded-xl transition"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0 overflow-hidden border border-blue-100">
                            {doc.fileUrl ? (
                              <img
                                src={doc.fileUrl}
                                alt={doc.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span>
                                {doc.name
                                  ?.split(" ")
                                  .map((w) => w.charAt(0).toUpperCase())
                                  .slice(0, 2)
                                  .join("")}
                              </span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-semibold text-sm text-slate-800 truncate">
                              Dr.{" "}
                              {doc.name
                                ? doc.name
                                    .split(" ")
                                    .map(
                                      (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
                                    )
                                    .join(" ")
                                : "Doctor"}
                            </h3>
                            <p className="text-xs text-blue-600 font-medium truncate">
                              {doc.specialization || "General Physician"}
                              {doc.qualification ? ` • ${doc.qualification}` : ""}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {doctors.length > 5 && (
                <div className="pt-3 border-t border-slate-100 text-center">
                  <Link
                    to="/hospital/doctors"
                    className="text-xs font-semibold text-blue-600 hover:underline"
                  >
                    + {doctors.length - 5} more doctors
                  </Link>
                </div>
              )}
            </div>

            {/* Upcoming Appointments */}
            <div className="bg-white border border-blue-100 rounded shadow-sm p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="text-blue-600" size={20} />
                    <h2 className="text-lg font-bold text-slate-800">
                      Recent Appointments ({appointments.length})
                    </h2>
                  </div>
                  <Link
                    to="/hospital/appointments"
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition"
                  >
                    View All <ArrowRight size={14} />
                  </Link>
                </div>

                {appointments.length === 0 ? (
                  <div className="text-center py-10">
                    <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-3 text-xl">
                      📅
                    </div>
                    <p className="text-slate-500 text-sm font-medium">
                      No appointments at this hospital yet.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 mt-2">
                    {appointments.slice(0, 5).map((appt) => (
                      <div
                        key={appt.id}
                        className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50/60 px-2 rounded-xl transition"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                            <CalendarDays size={18} />
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-semibold text-sm text-slate-800 truncate">
                              {appt.patient?.name
                                ? appt.patient.name
                                    .split(" ")
                                    .map(
                                      (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
                                    )
                                    .join(" ")
                                : "Patient"}
                            </h3>
                            <p className="text-xs text-slate-500 truncate">
                              with{" "}
                              <span className="font-medium text-blue-600">
                                Dr. {appt.doctor?.name || "Doctor"}
                              </span>
                              {appt.doctor?.specialization
                                ? ` (${appt.doctor.specialization})`
                                : ""}
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              📅 {new Date(appt.scheduledAt).toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <div className="shrink-0">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                              appt.status === "booked"
                                ? "bg-blue-50 text-blue-700 border border-blue-200"
                                : appt.status === "completed"
                                ? "bg-green-50 text-green-700 border border-green-200"
                                : "bg-red-50 text-red-700 border border-red-200"
                            }`}
                          >
                            {appt.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {appointments.length > 5 && (
                <div className="pt-3 border-t border-slate-100 text-center">
                  <Link
                    to="/hospital/appointments"
                    className="text-xs font-semibold text-blue-600 hover:underline"
                  >
                    + {appointments.length - 5} more appointments
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
