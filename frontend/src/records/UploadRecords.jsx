import { useState } from "react";
import api from "../api/axios";

export default function UploadRecord({showUploadModal, setShowUploadModal}) {
  const [file, setFile] = useState(null);
  const [recordType, setRecordType] = useState("");
  const [loading, setLoading] = useState(false)

  const handleUpload = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("recordType", recordType);

    try {
      await api.post("/patient/upload-records", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Uploaded!");
      setLoading(false)
      setRecordType("");
      setFile(null);
    } catch (err) {
      alert("Upload failed");
    }
    finally {
    setLoading(false);
  }
  };

 return (
  <>
    {showUploadModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
        <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl overflow-hidden animate-[fadeIn_.3s_ease]">

          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-5 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Upload Medical Record
              </h2>
              <p className="text-sm text-blue-100 mt-1">
                Securely upload your medical reports.
              </p>
            </div>

            <button
              onClick={() => setShowUploadModal(false)}
              className="h-10 w-10 rounded-full bg-white/20 text-white text-xl hover:bg-red-500 transition flex items-center justify-center"
            >
              ✕
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleUpload} className="p-6 space-y-6">

            {/* Record Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Record Type
              </label>

              <input
                type="text"
                value={recordType}
                onChange={(e) => setRecordType(e.target.value)}
                placeholder="e.g. Blood Test, X-Ray, MRI"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition"
              />
            </div>

            {/* Upload File */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Upload File
              </label>

              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                className="w-full rounded-xl border border-gray-300 p-3 file:mr-4 file:px-4 file:py-2 file:rounded-lg file:border-0 file:bg-blue-100 file:text-blue-700 file:font-medium hover:file:bg-blue-200"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3">

              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="rounded-xl border border-gray-300 px-5 py-3 font-medium text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className={`rounded-xl px-6 py-3 font-semibold text-white shadow-lg transition ${
                  loading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-cyan-500 hover:scale-105 hover:shadow-xl"
                }`}
              >
                {loading ? "Uploading..." : "Upload Record"}
              </button>

            </div>

          </form>

        </div>
      </div>
    )}
  </>
);
}
