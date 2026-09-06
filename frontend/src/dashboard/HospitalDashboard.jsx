import {
  Building2,
  Trash2,
  CalendarDays,
  Users,
  ClipboardList,
} from "lucide-react";

export default function HospitalDashboard() {
  return (
    <div className="min-h-screen bg-slate-50 p-4">

      {/* Header */}
      <div className="bg-white border border-blue-100 rounded-2xl shadow-sm p-6 flex items-center gap-5">

        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
          <Building2 className="text-blue-600" size={30} />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Apollo Hospital, Agra
          </h1>

          <p className="text-slate-500">
            Sanjay Place, Agra • Reg. APL001
          </p>
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

                  <p className="text-slate-500">
                    {item.title}
                  </p>

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

              <h3 className="font-semibold text-lg">
                {doctor.name}
              </h3>

              <p className="text-slate-500">
                {doctor.dept}
              </p>

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

                <p className="text-blue-600">
                  with {appointment.doctor}
                </p>

                <p className="text-slate-500 text-sm">
                  {appointment.time}
                </p>

              </div>

            </div>

          </div>

        ))}

      </div>
    </div>
  );
}