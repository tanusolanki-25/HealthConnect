import { useEffect, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
import { FileText, Search, RefreshCw, ExternalLink, Trash2, Calendar } from "lucide-react";

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
    const confirmed = window.confirm("Delete this record?");
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
    <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded shadow-sm border border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-blue-100 text-blue-700 rounded-xl">
                <FileText className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-bold text-gray-900">
                Medical Records
              </h1>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Track & view your uploaded medical history and doctor reports
            </p>
          </div>

          <button
            onClick={fetchRecords}
            className="flex items-center gap-2 self-start md:self-auto px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh List
          </button>
        </div>

        {/* Controls: Search & Source Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Search bar */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search records..."
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
            <h3 className="text-lg font-bold text-gray-800">No records found</h3>
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
                  className="bg-white rounded p-5 shadow-sm border border-gray-200/70 hover:shadow-md transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Record Thumbnail & Details */}
                    <div className="flex items-center gap-3.5">
                      {isImage ? (
                        <img
                          src={rec.fileUrl}
                          alt={rec.recordType}
                          className="w-11 h-11 rounded-xl object-cover border border-gray-200 shadow-sm shrink-0"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                          <FileText className="w-5 h-5" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-gray-900 text-base">
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
                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mt-0.5">
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
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-gray-400" />
                            Uploaded: {new Date(rec.uploadDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <a
                        href={rec.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-xl transition"
                      >
                        View <ExternalLink className="w-3.5 h-3.5" />
                      </a>

                      <button
                        onClick={() => handleDelete(rec.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-xl transition"
                      >
                        Delete <Trash2 className="w-3.5 h-3.5" />
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
  );
}

