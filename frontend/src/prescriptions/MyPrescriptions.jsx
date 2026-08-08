import { useEffect, useState } from "react"
import api from "../api/axios"

export default function MyPrescriptions() {
  const [prescriptions, setPrescriptions] = useState([])
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/patient/prescriptions")
      .then((res) => setPrescriptions(res.data.data))
      setLoading(false);
  }, [])

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
    <div className="bg-white max-w-6xl p-4 mx-auto shadow-sm mb-3 rounded-xl text-center">
      <h2 className="text-3xl font-bold text-blue-700">
        My Prescriptions
      </h2>
    </div>
    <div className="max-w-6xl mx-auto">

      {prescriptions.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-8 text-center text-gray-500">
          No prescriptions available.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {prescriptions.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition"
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-2xl">
                  💊
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Prescription
                  </h3>

                  <p className="text-sm text-gray-500">
                    {new Date(p.issuedDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Doctor */}
              <div className="mb-4">
                <p className="text-gray-700">
                  <span className="font-semibold">Doctor:</span>{" "}
                  Dr. {p.doctor.name}
                </p>
              </div>

              {/* Medicines */}
              <div className="mb-5">
                <p className="font-semibold text-gray-800 mb-2">
                  Medicines
                </p>

                <div className="bg-gray-50 rounded-lg p-3 text-gray-700 whitespace-pre-line">
                  {p.medicines}
                </div>
              </div>

              {/* Footer */}
              <div className="border-t pt-3 text-sm text-gray-500">
                Issued on{" "}
                {new Date(p.issuedDate).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);}