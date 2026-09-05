import { useEffect, useState } from "react";
import api from "../api/axios";
import Select from "react-select";
import toast from "react-hot-toast";

export default function BookAppointment({
  showAppointment,
  setShowAppointment,
}) {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/search/doctors").then((res) => {
      setDoctors(res.data.data);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await api.post("/patient/appointments", {
        doctorId: selectedDoctorId.value,
        scheduledAt,
      });

      toast.success("Appointment booked successfully!");

      setSelectedDoctorId("");
      setScheduledAt("");
    } catch (err) {
      console.log(err);
      toast.error("Booking failed");
      setSelectedDoctorId("");
      setScheduledAt("");
    } finally {
      setLoading(false);
    }
  };

  const doctorOptions = doctors.map((doc) => ({
    value: doc.id,
    label: doc.name,
    specialization: doc.specialization,
    experience: doc.experience,
    consultationFee: doc.consultationFee,
  }));

  const customStyles = {
    control: (provided) => ({
      ...provided,
      minHeight: "45px",
      height: "45px",
      borderRadius: "10px",
    }),

    valueContainer: (provided) => ({
      ...provided,
      height: "45px",
      display: "flex",
      alignItems: "center",
      padding: "0 12px",
    }),

    input: (provided) => ({
      ...provided,
      margin: 0,
      padding: 0,
    }),

    indicatorsContainer: (provided) => ({
      ...provided,
      height: "40px",
    }),

    singleValue: (provided) => ({
      ...provided,
      margin: 0,
    }),
  };

  const CustomOption = ({ innerRef, innerProps, data }) => (
    <div
      ref={innerRef}
      {...innerProps}
      className="flex items-center gap-3 p-3 hover:bg-blue-50 cursor-pointer"
    >
      <div>
        <p className="font-semibold">
          {data.label
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")}
        </p>

        <p className="text-sm text-gray-500">
          {data.specialization
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")}
        </p>
        <div className="flex gap-9 ">
          <p className="text-xs text-blue-600">
            {data.experience} Years Experience
          </p>
          <p className="text-xs flex  text-blue-600 pl-58">
            Fees : ₹{data.consultationFee}
          </p>
        </div>
      </div>
    </div>
  );

  const CustomSingleValue = ({ data }) => (
    <span className="font-medium text-gray-800">{data.label}</span>
  );

  const handleClose = () => {
    setScheduledAt("");
    setSelectedDoctorId("");
    setShowAppointment(false);
  };

  return (
    <>
      {showAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl overflow-hidden animate-[fadeIn_.3s_ease]">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-5 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Book Appointment
                </h2>
                <p className="text-blue-100 text-sm mt-1">
                  Schedule your consultation with a doctor
                </p>
              </div>

              <button
                onClick={() => handleClose()}
                className="h-10 w-10 rounded-full bg-white/20 text-white text-xl hover:bg-red-500 transition flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Doctor */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Doctor
                </label>
                <Select
                  isSearchable={false}
                  styles={customStyles}
                  options={doctorOptions}
                  value={selectedDoctorId}
                  onChange={(option) => setSelectedDoctorId(option)}
                  placeholder="Select Doctor"
                  components={{
                    Option: CustomOption,
                    SingleValue: CustomSingleValue,
                  }}
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Appointment Date & Time
                </label>

                <input
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition"
                />
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleClose()}
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
                  {loading ? "Booking..." : "Book Appointment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
