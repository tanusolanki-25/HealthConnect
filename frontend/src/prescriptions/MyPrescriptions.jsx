import { useEffect, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
import { Pill, Calendar, Stethoscope, Loader2, Trash2 } from "lucide-react";
import SideBar from "../dashboard/SideBar";

export default function MyPrescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const res = await api.get("/patient/prescriptions");
      setPrescriptions(res.data.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not fetch prescriptions");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this prescription?");
    if (!confirmed) return;

    try {
      await api.delete(`/patient/prescriptions/${id}`);
      toast.success("Prescription deleted successfully");
      fetchPrescriptions();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not delete prescription");
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] overflow-hidden">
      <div className="flex h-full">
        <SideBar />

        <div className="flex-1 md:ml-64 h-full flex flex-col p-2">
          {/* Header */}
          <div className="bg-white rounded p-6 shadow-sm border border-gray-100 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <Pill className="w-6 h-6" />
                </span>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                  My Prescriptions
                </h1>
              </div>
              <p className="text-gray-500 text-sm mt-1">
                View digital prescriptions issued by your consulting doctors
              </p>
            </div>

            <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl text-xs font-semibold self-start sm:self-auto border border-blue-100">
              Total: {prescriptions.length}
            </div>
          </div>

          {/* Prescriptions Grid */}
          <div className="flex-1 hide-scrollbar overflow-y-auto mt-2">
          {loading ? (
            <div className="bg-white rounded p-12 text-center border border-gray-100 shadow-sm">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
              <p className="text-gray-500 text-sm font-medium">Loading prescriptions...</p>
            </div>
          ) : prescriptions.length === 0 ? (
            <div className="bg-white rounded p-12 text-center border border-gray-100 shadow-sm">
              <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                💊
              </div>
              <h3 className="text-lg font-bold text-gray-800">No Prescriptions Issued</h3>
              <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">
                No doctor prescriptions have been uploaded or assigned to your profile yet.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {prescriptions.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200/80 p-6 flex flex-col justify-between"
                >
                  <div>
                    {/* Header with Doctor */}
                    <div className="flex items-start justify-between gap-3 mb-4 pb-4 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                          <Stethoscope size={20} />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-gray-900">
                            Dr. {p.doctor?.name}
                          </h3>
                          <p className="text-xs text-blue-600 font-medium">
                            {p.doctor?.specialization}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition"
                        title="Delete Prescription"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {/* Medicines List */}
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        Prescribed Medicines & Dosage
                      </p>
                      <div className="bg-slate-50/80 rounded-xl p-3.5 text-gray-800 text-sm font-medium leading-relaxed whitespace-pre-line border border-gray-100">
                        {p.medicines}
                      </div>
                    </div>

                    {/* Notes if any */}
                    {p.notes && (
                      <div className="mb-4">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                          Doctor Notes
                        </p>
                        <p className="text-xs text-gray-600 italic bg-amber-50/60 p-2.5 rounded-lg border border-amber-100">
                          "{p.notes}"
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                    <span className="flex items-center gap-1 font-medium">
                      <Calendar size={13} />
                      Issued: {new Date(p.issuedDate).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
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
