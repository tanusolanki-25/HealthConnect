import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import toast from "react-hot-toast"
import api from "../api/axios"
import { Calendar, ExternalLink, FileText, Search } from "lucide-react"

export default function ViewRecords({ patientId: propPatientId }) {
  const params = useParams()
  const patientId = propPatientId || params.patientId

  const [records, setRecords] = useState([])
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSource, setFilterSource] = useState("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!patientId) {
      setLoading(false)
      return
    }

    setLoading(true)
    api
      .get(`/doctor/medical-records/patient/${patientId}`)
      .then((res) => setRecords(res.data.data || []))
      .catch((err) => {
        toast.error(err.response?.data?.message || "Could not fetch medical records")
      })
      .finally(() => setLoading(false))
  }, [patientId])

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-2xl font-semibold text-blue-600 animate-pulse">
          Loading Patient Records...
        </p>
      </div>
    )
  }

  return (
    <div className="p-2">
      <div className="max-w-5xl mx-auto">
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
          </div>
          <div className="flex-1 hide-scrollbar overflow-y-auto mt-2">
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
  )
}
