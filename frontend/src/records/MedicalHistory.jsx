import { useEffect, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
import Sidebar from "../dashboard/SideBar";
import { FileText, Search, RefreshCw, ExternalLink, Trash2, Calendar, FileCheck } from "lucide-react";

export default function MedicalHistory() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSource, setFilterSource] = useState("all");

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await api.get("/patient/records/my-history");
      setRecords(res.data.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not fetch records");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (recId) => {
    const confirmed = window.confirm("Are you sure you want to delete this medical record?");
    if (!confirmed) return;
    try {
      await api.delete(`/patient/medical-records/${recId}`);
      toast.success("Record deleted successfully");
      fetchRecords();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete record");
    }
  };

  const filteredRecords = records.filter((rec) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      rec.recordType?.toLowerCase().includes(query) ||
      rec.doctor?.name?.toLowerCase().includes(query);

    const matchesFilter =
      filterSource === "all" ||
      (filterSource === "doctor" && rec.doctor) ||
      (filterSource === "self" && !rec.doctor);

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-slate-50/80 p-3 sm:p-2">
      <div className="flex flex-col md:flex-row gap-2 max-w-9xl mx-auto">
        <Sidebar />

        <div className="flex-1 min-w-0 space-y-4">
          {/* Header */}
          <div className="bg-white rounded p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <FileCheck className="w-6 h-6" />
                </span>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                  Medical Records
                </h1>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Track & view your uploaded medical history and doctor reports
              </p>
            </div>

            <button
              onClick={fetchRecords}
              className="flex items-center gap-2 self-start md:self-auto px-4 py-2.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition border border-blue-100"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>Refresh List</span>
            </button>
          </div>

          {/* Controls: Search & Source Filters */}
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

            {/* Filter Buttons */}
            <div className="flex items-center bg-white p-1 rounded-xl border border-gray-200 shadow-sm w-full sm:w-auto">
              {["all", "doctor", "self"].map((source) => (
                <button
                  key={source}
                  onClick={() => setFilterSource(source)}
                  className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
                    filterSource === source
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  {source === "all"
                    ? "All Records"
                    : source === "doctor"
                    ? "Doctor Added"
                    : "Self Uploaded"}
                </button>
              ))}
            </div>
          </div>

          {/* Record Cards List */}
          {loading ? (
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
          ) : filteredRecords.length === 0 ? (
            <div className="bg-white rounded p-12 text-center border border-gray-100 shadow-sm">
              <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                📋
              </div>
              <h3 className="text-lg font-bold text-gray-800">No Medical Records Found</h3>
              <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">
                {searchQuery || filterSource !== "all"
                  ? "No medical records match your search or filter parameters."
                  : "You haven't uploaded or received any medical records yet."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRecords.map((rec) => {
                const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(rec.fileUrl);
                const isDoctorUploaded = !!rec.doctor;

                return (
                  <div
                    key={rec.id}
                    className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200/80 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      {/* Record Thumbnail & Details */}
                      <div className="flex items-center gap-4">
                        {isImage ? (
                          <img
                            src={rec.fileUrl}
                            alt={rec.recordType}
                            className="w-12 h-12 rounded-xl object-cover border border-gray-200 shadow-sm shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                            <FileText className="w-6 h-6" />
                          </div>
                        )}
                        <div>
                          <h3 className="font-bold text-gray-900 text-base">
                            {rec.recordType
                              ? rec.recordType
                                  .split(" ")
                                  .map(
                                    (w) =>
                                      w.charAt(0).toUpperCase() + w.slice(1)
                                  )
                                  .join(" ")
                              : "Medical Record"}
                          </h3>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mt-1">
                            <span
                              className={`px-2 py-0.5 rounded-md font-medium ${
                                isDoctorUploaded
                                  ? "bg-indigo-50 text-indigo-700 border border-indigo-100"
                                  : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                              }`}
                            >
                              {isDoctorUploaded
                                ? `👨‍⚕️ Dr. ${rec.doctor.name}`
                                : "👤 Self Uploaded"}
                            </span>
                            <span className="flex items-center gap-1 font-medium">
                              <Calendar className="w-3.5 h-3.5 text-gray-400" />
                              {new Date(rec.uploadDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2.5 self-end sm:self-auto">
                        <a
                          href={rec.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-xl transition border border-blue-100"
                        >
                          <span>View Document</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>

                        <button
                          onClick={() => handleDelete(rec.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-xl transition border border-rose-100"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
