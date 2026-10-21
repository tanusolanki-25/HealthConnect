import { useState } from "react"
import { Pill, FileText, Send, X, Loader2 } from "lucide-react"
import toast from "react-hot-toast"
import api from "../api/axios"

export default function PrescriptionForm({ patientId, patientName, showPrescription, setShowPrescription, onDone }) {
  const [medicines, setMedicines] = useState("")
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!medicines.trim()) {
      toast.error("Please enter medicine details")
      return
    }

    setLoading(true)
    try {
      await api.post("/doctor/prescriptions", {
        patientId,
        medicines: medicines.trim(),
        notes: notes.trim(),
      })
      toast.success("Prescription issued successfully!")
      if (onDone) onDone()
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save prescription")
    } finally {
      setLoading(false)
    }
  }

 return (
  <>
    {showPrescription && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
        <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl overflow-hidden animate-[fadeIn_.3s_ease]">

          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-5 flex items-center justify-between">

            <div>
              <h2 className="text-2xl font-bold text-white">
                New Prescription
              </h2>

              {patientName && (
                <p className="text-blue-100 mt-1">
                  For: {patientName}
                </p>
              )}
            </div>

            <button
              onClick={onDone}
              className="h-10 w-10 rounded-full bg-white/20 text-white hover:bg-red-500 transition flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>

          </div>

          {/* Body */}
          <form
            onSubmit={handleSubmit}
            className="p-6 space-y-6"
          >

            {/* --------- Yahan se tumhara pura existing form --------- */}

            {/* Medicines */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Medicines & Dosage
              </label>

              <textarea
                rows={4}
                placeholder="e.g. Paracetamol 500mg..."
                value={medicines}
                onChange={(e) => setMedicines(e.target.value)}
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Additional Notes
              </label>

              <textarea
                rows={3}
                placeholder="Advice..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none"
              />
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3">

              <button
                type="button"
                onClick={onDone}
                className="rounded-xl border border-gray-300 px-5 py-3 font-medium hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className={`rounded-xl px-6 py-3 font-semibold text-white transition ${
                  loading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-cyan-500 hover:scale-105"
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 inline mr-2" />
                    Save & Send
                  </>
                )}
              </button>

            </div>
          </form>
        </div>
      </div>
    )}
  </>
);
}