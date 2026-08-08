import { useEffect, useState } from "react"
import api from "../api/axios"

export default function AccessRequests() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = () => {
    api.get("/patient/access-requests")
      .then((res) => setRequests(res.data.data))
      setLoading(false)
  }

  const handleApprove = async (id) => {
    await api.patch(`/patient/access-requests/${id}/approve`)
    fetchRequests()
  }

  const handleDeny = async (id) => {
    await api.patch(`/patient/access-requests/${id}/deny`)
    fetchRequests()
  }

  if (loading)
   return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-2xl font-semibold text-blue-600 animate-pulse">
        Loading...
      </p>
    </div>
  );

return (
  <div className="min-h-screen bg-gray-100 mt-20 p-6">
    <div className="max-w-5xl mx-auto">
      
      {/* Empty State */}
      {requests.length === 0 ? (
        <div className="bg-white rounded-2xl shadow p-10 text-center">
          <h2 className="text-xl font-semibold text-gray-700">
            No Requests Yet
          </h2>
          <p className="text-gray-500 mt-2">
            You don't have any access requests at the moment.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {requests.map((req) => (
            <div
              key={req.id}
              className="bg-white rounded-2xl shadow hover:shadow-lg transition p-6 border border-gray-100"
            >
              <div className="flex flex-col md:flex-row justify-between md:items-center">

                {/* Doctor Info */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Dr. {req.doctor.name}
                  </h2>

                  <p className="text-gray-500 mt-1">
                    {req.doctor.specialization}
                  </p>
                </div>

                {/* Status */}
                <div className="mt-4 md:mt-0">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-medium
                      ${
                        req.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : req.status === "denied"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                  >
                    {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                  </span>
                </div>
              </div>

              {/* Buttons */}
              {req.status === "pending" && (
                <div className="flex gap-4 mt-6">

                  <button
                    onClick={() => handleApprove(req.id)}
                    className="px-5 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => handleDeny(req.id)}
                    className="px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                  >
                    Deny
                  </button>

                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);
}