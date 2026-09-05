import { useEffect, useState } from "react";
import api from "../api/axios";
import SideBar from "../dashboard/SideBar";

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
     <div className="h-[calc(100vh-4rem)] overflow-hidden">
           <div className="flex h-full">
             <SideBar />
     
             <div className="flex-1 md:ml-64 h-full flex flex-col p-2">
        <div className="flex-1 hide-scrollbar overflow-y-auto">
        {prescriptions.length === 0 ? (
          <div className="bg-white rounded p-12 text-center border border-gray-100 shadow-sm">
              <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                💊
              </div>
              <h3 className="text-lg font-bold text-gray-800">No Prescriptions Issued</h3>

            </div>
        ) : (
          <div className="space-y-5">
            {prescriptions.map((p) => (
              <div
                key={p.id}
                className="bg-white border border-gray-200 rounded shadow-sm hover:shadow-md transition duration-300 p-5"
              >
                  <h2 className="text-2xl font-bold text-black">
                💊 Prescriptions Issued
              </h2>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                   <p className="text-gray-700">
                      <span className="font-medium text-gray-900">
                        Patient:
                      </span>{" "}
                      {p.patient.name.split(' ').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                    </p>


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
      </div>
    </div>
  );
}
