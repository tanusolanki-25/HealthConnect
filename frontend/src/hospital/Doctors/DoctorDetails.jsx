import {
  Mail,
  BadgeCheck,
  Calendar,
  Stethoscope,
  FileText,
  Phone,
} from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

const DoctorDetails = ({ doctorId: propPatientId }) => {
  const params = useParams();
  const doctorId = propPatientId || params.doctorId;
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashborad();
  }, []);

  const fetchDashborad = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/hospital/doctors/${doctorId}`);
      console.log(res.data.data)
      setData(res.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not fetch dashboard")
    } finally{
       setLoading(false)
    }
  };

  const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(data.fileUrl);

  if (loading) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
        <p className="text-2xl font-semibold text-blue-600 animate-pulse">
          Loading doctor dashboard...
        </p>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-4rem)] bg-slate-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded shadow-lg ">
        {/* Header */}
        <div className="bg-gradient-to-r rounded from-blue-600 to-cyan-500 h-25 relative">
          <div className="absolute left-8 -bottom-12">
            {isImage ? (
              <img
                src={data.fileUrl}
                className="w-24 h-24 rounded-full border-4 border-white"
              />
            ) : (
              <div className="w-24 h-24 rounded-full border-4 bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border-blue-100">
                <FileText className="w-6 h-6" />
              </div>
            )}
          </div>
        </div>

        <div className="pt-16 px-8 pb-8">
          <h1 className="text-3xl font-bold">
            {data.name
              .split(" ")
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(" ")}
          </h1>

          <p className="text-slate-500 flex items-center gap-2 mt-2">
            <Stethoscope size={18} />
            {data.specialization
              .split(" ")
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(" ")}
          </p>

          {/* Information */}
          <h2 className="font-semibold text-lg mt-4">
            Personal Information
          </h2>
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div className="bg-slate-50 rounded-xl p-5">
              <div className="space-y-2">
                {data?.user?.email && (
                  <div className="flex items-center gap-3">
                    <Mail size={18} />
                    {data.user.email}
                  </div>
                )}

                {data?.user?.email && (
                  <div className="flex items-center gap-3">
                    <Calendar size={18} />
                    {new Date(data.user.createdAt).toLocaleDateString()}
                  </div>
                )}
                {data?.phone && (
                  <div className="flex items-center gap-3">
                    <Phone size={18} />
                    {data.phone}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-5">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <BadgeCheck size={18} />
                  {data.licenseNo}
                </div>
                <div>Hospital ID : {data.hospitalId}</div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-5 mt-4">
            <div className="bg-blue-50 rounded-xl p-6">
              <p className="text-slate-500">Appointments</p>
              {data?._count?.appointments && (
                <h2 className="text-4xl font-bold text-blue-600 mt-2">
                  {data._count.appointments}
                </h2>
              )}
            </div>

            <div className="bg-green-50 rounded-xl p-6">
              <p className="text-slate-500">Prescriptions</p>
              {data?._count?.prescriptions && (
                <h2 className="text-4xl font-bold text-green-600 mt-2">
                  {data._count.prescriptions}
                </h2>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetails;
