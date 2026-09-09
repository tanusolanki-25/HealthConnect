import { useEffect, useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import SideBar from "../../dashboard/SideBar";
import { ArrowRight, CalendarDays, ClipboardList, ExternalLink, FileText, Loader2, Pill, ShieldCheck, Users } from "lucide-react";
import { Search, Plus, Eye, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";


const DoctorList = ({ sidebarOpen, setSidebarOpen }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const res = await api.get("/hospital/doctors");
      setDoctors(res.data.data || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Could not fetch doctor records",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveDoctor = async (doctorId, doctorName) => {
    if (!window.confirm(`Are you sure you want to remove Dr. ${doctorName} from this hospital?`)) {
      return;
    }
    try {
      await api.delete(`/hospital/doctors/${doctorId}`);
      toast.success("Doctor affiliation removed successfully");
      fetchDashboard();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to remove doctor");
    }
  };

  const filteredRecords = doctors.filter((rec) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      rec.name?.toLowerCase().includes(query) ||
      rec.specialization?.toLowerCase().includes(query);
    return matchesSearch;
  });


  if (loading) {
    return (
      <div className="h-[calc(100vh-4rem)] overflow-hidden flex items-center justify-center">
        <p className="text-2xl font-semibold text-blue-600 animate-pulse">
          Loading doctor records...
        </p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] overflow-hidden">
      <div className="h-full">
        <SideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex-1 md:ml-64 h-full flex flex-col p-2  ">
          {/* Header */}
          <div className="bg-white rounded p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between md:items-center gap-5 mb-2">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">
                Doctor Management
              </h1>
              <p className="text-slate-500">
                Manage all doctors in your hospital
              </p>
            </div>
            <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl text-xs font-semibold self-start sm:self-auto border border-blue-100">
              Total: {doctors.length}
            </div>
          </div>

          {/* Search + Filters */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-2">
            {/* Search bar */}
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by record title or doctor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition shadow-sm"
              />
            </div>
          </div>

          {/* Table */}
           <div className="grid grid-cols-1 lg:grid-cols-1 overflow-y-auto hide-scrollbar h-full">
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
                    {filteredRecords.slice(0, 5).map((doc) => (
                      <div
                        key={doc.id}
                        className="py-5 flex items-center justify-between gap-3 hover:bg-slate-50/60 px-2 rounded-xl transition"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0 overflow-hidden border border-blue-100">
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
                            <h3 className="font-semibold text-slate-800 truncate">
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
                            <p className=" text-blue-600 font-medium truncate">
                              {doc.specialization.split(" ")
                                    .map(
                                      (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
                                    )
                                    .join(" ") || "General Physician"}
                              {doc.qualification ? ` • ${doc.qualification}` : ""}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <Link
                            to={`/hospital/doctors/${doc.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="View Doctor Details"
                          >
                            <ExternalLink size={18} />
                          </Link>
                          <button
                            onClick={() => handleRemoveDoctor(doc.id, doc.name)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Remove Affiliation"
                          >
                            <Trash2 size={18} />
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
      </div>
    </div>
  );
};

export default DoctorList;
