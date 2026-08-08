import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { ShieldCheck, Clock, XCircle, Search, ExternalLink, FilePlus, UserCheck, RefreshCw } from "lucide-react"
import toast from "react-hot-toast"
import api from "../api/axios"
import PrescriptionForm from "../prescriptions/PrescriptionForm"

export default function SentAccessRequests() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [writingFor, setWritingFor] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [showPrescription, setShowPrescription] = useState(false)

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    setLoading(true)
    try {
      const res = await api.get("/doctor/access-request/sent")
      setRequests(res.data.data || [])
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not fetch access requests")
    } finally {
      setLoading(false)
    }
  }

  const filteredRequests = requests.filter((req) => {
    const matchesSearch = req.patient?.name
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase())
    const matchesStatus =
      filterStatus === "all" || req.status === filterStatus
    return matchesSearch && matchesStatus
  })

  return (
    <div className="mt-20 min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-blue-100 text-blue-700 rounded-xl">
                <UserCheck className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-bold text-gray-900">
                Sent Patient Access Requests
              </h1>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Track permissions requested from patients to view records & issue prescriptions
            </p>
          </div>

          <button
            onClick={fetchRequests}
            className="flex items-center gap-2 self-start md:self-auto px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh List
          </button>
        </div>

        {/* Controls: Search & Status Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Search bar */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search patient name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition shadow-sm"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex items-center bg-white p-1 rounded-xl border border-gray-200 shadow-sm w-full sm:w-auto">
            {["all", "approved", "pending", "denied"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
                  filterStatus === status
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Request Cards List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse flex justify-between items-center"
              >
                <div className="space-y-2">
                  <div className="h-5 bg-gray-200 rounded w-48"></div>
                  <div className="h-4 bg-gray-100 rounded w-32"></div>
                </div>
                <div className="h-8 bg-gray-200 rounded-xl w-24"></div>
              </div>
            ))}
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
            <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
              📋
            </div>
            <h3 className="text-lg font-bold text-gray-800">No requests found</h3>
            <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">
              {searchQuery || filterStatus !== "all"
                ? "No access requests match your search or filter parameters."
                : "You haven't sent any access requests to patients yet."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200/70 hover:shadow-md transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Patient Details */}
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold flex items-center justify-center shadow-md">
                      {req.patient?.name?.slice(0, 2).toUpperCase() || "PT"}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-base">
                        {req.patient?.name
                          ? req.patient.name
                              .split(" ")
                              .map(
                                (w) => w.charAt(0).toUpperCase() + w.slice(1)
                              )
                              .join(" ")
                          : "Patient"}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                        {req.patient?.bloodGroup && (
                          <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded-md font-medium">
                            🩸 {req.patient.bloodGroup}
                          </span>
                        )}
                        <span>
                          Requested: {new Date(req.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-3">
                    <StatusBadge status={req.status} />

                    {req.status === "approved" && (
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/doctor/records/${req.patientId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-xl transition"
                        >
                          View Records <ExternalLink className="w-3.5 h-3.5" />
                        </Link>

                        <button
                          onClick={() =>{
                            setWritingFor(
                              writingFor === req.patientId ? null : req.patientId
                            )
                        setShowPrescription(true);}
                          }
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition"
                        >
                          <FilePlus className="w-3.5 h-3.5" /> Prescribe
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Inline Prescription Form Expansion */}
                {req.status === "approved" && writingFor === req.patientId && (
                  <div className=" border-gray-100">
                    <PrescriptionForm
                      patientId={req.patientId}
                      patientName={req.patient?.name}
                      showPrescription={showPrescription}
                      setShowPrescription={setShowPrescription}
                      onDone={() => setWritingFor(null)}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function StatusBadge({ status }) {
  const config = {
    approved: {
      bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
      icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />,
      text: "Approved",
    },
    pending: {
      bg: "bg-amber-50 text-amber-700 border-amber-200",
      icon: <Clock className="w-3.5 h-3.5 text-amber-600" />,
      text: "Pending Approval",
    },
    denied: {
      bg: "bg-rose-50 text-rose-700 border-rose-200",
      icon: <XCircle className="w-3.5 h-3.5 text-rose-600" />,
      text: "Denied",
    },
  }

  const current = config[status] || {
    bg: "bg-gray-50 text-gray-700 border-gray-200",
    icon: null,
    text: status,
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border ${current.bg}`}
    >
      {current.icon}
      {current.text}
    </span>
  )
}