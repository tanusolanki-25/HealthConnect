import { useEffect, useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import SideBar from "../../dashboard/SideBar";
import { ExternalLink, FileText, Loader2, Pill } from "lucide-react";
import { Search, Plus, Eye, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";


const DoctorList = () => {
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
      setDoctors(res.data.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Could not fetch doctor records",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (doctorId) => {
    await api.delete(`/hospital/doctors/${doctorId}`);
    fetchDoctors();
    toast.success("Doctor records deleted successfully");
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
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-2xl font-semibold text-blue-600 animate-pulse">
          Loading doctor records...
        </p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] overflow-hidden">
      <div className="h-full">
        <SideBar />
        <div className="flex-1 md:ml-64 h-full flex flex-col p-2">
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
              Total: 0
            </div>
          </div>

          {/* Search + Filters */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
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
          <div className="mt-2 overflow-x-auto bg-white rounded p-6 shadow-sm border border-gray-100">
            <table className="w-full">
              <thead className="bg-slate-100">
                <tr>
                  <th className="text-left p-4">Photo</th>
                  <th className="text-left p-4">Doctor Name</th>
                  <th className="text-left p-4">Specialization</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-center p-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredRecords.map((doctor) => (
                  <tr
                    key={doctor.id}
                    className="border-b border-gray-300 hover:bg-slate-50 transition"
                  >
                    <td className="p-4">
                      {doctor.fileUrl ? (
                        <img
                          src={doctor.fileUrl}
                          alt={doctor.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full border-4 bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border-blue-100">
                          <FileText className="w-6 h-6" />
                        </div>
                      )}
                    </td>

                    <td className="p-4 font-semibold text-slate-700">
                      {doctor.name.split(" ")
                                .map(
                                  (w) => w.charAt(0).toUpperCase() + w.slice(1),
                                )
                                .join(" ")}
                    </td>

                    <td className="p-4 text-slate-600">{doctor.specialization.split(" ")
                                .map(
                                  (w) => w.charAt(0).toUpperCase() + w.slice(1),
                                )
                                .join(" ")}</td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          doctor.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {doctor.status}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex justify-center gap-3">
                        <Link
                          to={`/hospital/doctors/${doctor.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-xl transition"
                        >
                          View <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(doctor.id)}
                          className="w-10 h-10 rounded-lg bg-red-100 hover:bg-red-200 flex items-center justify-center text-red-600"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorList;
