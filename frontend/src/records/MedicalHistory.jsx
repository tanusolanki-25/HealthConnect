import { useEffect, useState } from "react"
import api from "../api/axios"

export default function MedicalHistory() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRecords()
  }, [])

   const fetchRecords = async()=>{
    const res = await api.get("/patient/records/my-history")
    setRecords(res.data.data)

    setLoading(false)
   }

  const handleDelete = async(recId) =>{
    const confirmed = window.confirm("Delete this record?")
    if (!confirmed) return
    await api.delete(`/patient/medical-records/${recId}`)
    fetchRecords()

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
  <div className="m-25 px-6">
    <div className="bg-white max-w-7xl p-4 mx-auto shadow-sm mb-3 rounded-xl text-center">
      <h2 className="text-3xl font-bold text-blue-700">
        Medical History
      </h2>
    </div>
    <div className="max-w-7xl mx-auto">

      {records.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-8 text-center text-gray-500">
          No medical records found.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {records.map((rec) => {
            const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(rec.fileUrl);

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
                    <p className="text-gray-500 mt-2">PDF Report</p>
                  </div>
                )}

                {/* Details */}
                <div className="p-5">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {rec.recordType}
                  </h3>

                  <p className="text-gray-600 mt-2">
                    👨‍⚕️{" "}
                    {rec.doctor
                      ? `Dr. ${rec.doctor.name}`
                      : "Self Uploaded"}
                  </p>

                  <p className="text-gray-600 mt-1">
                    📅{" "}
                    {new Date(rec.uploadDate).toLocaleDateString()}
                  </p>

                  {/* Buttons */}
                  <div className="flex gap-3 mt-5">
                    <a
                      href={rec.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                      View
                    </a>
                    <button onClick={() => handleDelete(rec.id)} className="flex-1 bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700 transition">Delete</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  </div>
);}