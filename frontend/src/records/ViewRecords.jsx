import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import toast from "react-hot-toast"
import api from "../api/axios"

export default function ViewRecords({ patientId: propPatientId }) {
  const params = useParams()
  const patientId = propPatientId || params.patientId

  const [records, setRecords] = useState([])
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
      <div className="max-w-9xl mx-auto">
        {records.length === 0 ? (
          <div className="bg-white rounded shadow-md p-8 text-center text-gray-500">
             <div className="flex items-center justify-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-blue-700">
              Patient Medical Records
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Patient ID: <span className="font-mono text-gray-700 font-medium">{patientId}</span>
            </p>
          </div>
        </div>
            No medical records found for this patient.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {records.map((rec) => {
              const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(rec.fileUrl)

              return (
                <div
                  key={rec.id}
                  className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-xl transition"
                >
                  {/* Preview */}
                  {isImage ? (
                    <img
                      src={rec.fileUrl}
                      alt={rec.recordType}
                      className="w-full h-52 object-cover"
                    />
                  ) : (
                    <div className="w-full h-52 flex flex-col items-center justify-center bg-gray-100">
                      <span className="text-7xl">📄</span>
                      <p className="text-gray-500 mt-2">Document / PDF Report</p>
                    </div>
                  )}

                  {/* Details */}
                  <div className="p-5">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {rec.recordType}
                    </h3>

                    <p className="text-gray-600 mt-2 text-sm">
                      📅 Uploaded: {new Date(rec.uploadDate).toLocaleDateString()}
                    </p>

                    {/* Buttons */}
                    <div className="mt-5">
                      <a
                        href={rec.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full bg-blue-600 text-white text-center py-2.5 rounded-lg font-medium hover:bg-blue-700 transition"
                      >
                        View Full Document ↗
                      </a>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}