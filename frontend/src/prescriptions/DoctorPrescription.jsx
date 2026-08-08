import { useEffect, useState } from "react";
import api from "../api/axios";

export default function DoctorPrescription() {
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    fetchPrescriptions()
  }, []);

  const fetchPrescriptions = async()=>{
   const res = await api.get("/doctor/get-prescriptions")
   setPrescriptions(res.data.data)
  }

  const handleDelete = async(id) =>{
    await api.delete(`/doctor/prescriptions/${id}`)
    fetchPrescriptions()
  }

  return (
    <div className="min-h-screen mt-15 bg-gray-100 py-10 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-4 mb-3 text-center max-w-5xl mx-auto ">
        <h1 className="text-3xl font-bold text-blue-700">
          Prescriptions Issued
        </h1>
      </div>
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        {prescriptions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-500">
              No prescriptions issued yet.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {prescriptions.map((p) => (
              <div
                key={p.id}
                className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition duration-300 p-5"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      {p.patient.name.split(' ').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                    </h2>

                    <p className="mt-2 text-gray-700">
                      <span className="font-medium text-gray-900">
                        Medicines:
                      </span>{" "}
                      {p.medicines}
                    </p>

                    {p.notes && (
                      <p className="mt-2 text-gray-600">
                        <span className="font-medium text-gray-900">
                          Notes:
                        </span>{" "}
                        {p.notes}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="h-10 w-10 rounded-full flex items-center justify-center text-gray-500 hover:bg-red-500 hover:text-white transition"
                    >
                      ✕
                    </button>

                    <span className="mt-10 inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                      {new Date(p.issuedDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
