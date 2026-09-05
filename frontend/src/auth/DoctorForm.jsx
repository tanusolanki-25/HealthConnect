import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { ArrowLeft, Loader2, Save } from "lucide-react";

function DoctorForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null); // ✅ track file in state
  const { markProfileCompleted, user } = useAuth();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file); // ✅ store in state so onSubmit can access it
      setPreview(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    const fetchPatientProfile = async () => {
      try {
        const res = await api.get("/doctor/profile");
        const profile = res.data.data;

        if (profile) {
          setIsEditMode(true);
          setPreview(profile.fileUrl);
          reset({
            fullName: profile.name || "",           // ✅ fixed casing
            specialization: profile.specialization || "",
            qualification: profile.qualification || "",
            experience: profile.experience || "",
            phone: profile.phone || "",
            hospital: profile.hospital || "",
            consultationFee: profile.consultationFee || "",
            licenseNo: profile.licenseNo || "",
            address: profile.address || "",
          });
        }
      } catch (error) {
        setIsEditMode(false);
      }
    };

    fetchPatientProfile();
  }, [reset, user?.email]);

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      // ✅ Build a real FormData so multer can parse the file + text fields
      const payload = new FormData();
      payload.append("name", formData.fullName);        // ✅ fixed casing
      payload.append("specialization", formData.specialization);
      payload.append("qualification", formData.qualification);
      payload.append("experience", formData.experience);
      payload.append("phone", formData.phone || "");
      payload.append("hospital", formData.hospital || "");
      payload.append("consultationFee", formData.consultationFee);
      payload.append("licenseNo", formData.licenseNo);
      payload.append("address", formData.address || "");
      if (selectedFile) {
        payload.append("file", selectedFile);           // ✅ actual File object
      }

      if (isEditMode) {
        await api.patch("/doctor/update-profile", payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Profile updated successfully!");
      } else {
        await api.post("/doctor/profile", payload, {
          headers: { "Content-Type": "multipart/form-data" }, // ✅ tells axios/multer it's form-data
        });
        toast.success("Profile created successfully!");
        markProfileCompleted();
      }

      navigate("/doctor/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not save profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] overflow-y-auto bg-slate-50 px-4 py-2 flex justify-center items-start hide-scrollbar">
      <div className="w-full max-w-3xl bg-white rounded shadow-xl border border-gray-200 overflow-hidden ">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-teal-600 p-2 sm:p-3 text-center text-white">
          {isEditMode && (
          <div className="flex left-6"> 
            <Link
              to="/doctor/dashboard"
              className="absolute inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg text-xs font-semibold backdrop-blur-sm transition"
            >
              <ArrowLeft size={14} />
              <span>Back to Dashboard</span>
            </Link>
            </div>
          )}
          <h1 className="text-3xl font-bold">
            {isEditMode ? "Edit Doctor Profile" : "Complete Doctor Profile"}
          </h1>
          <p className="text-blue-100 mt-2">
            {isEditMode
              ? "Update your professional details."
              : "Complete your professional details."}
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-6 sm:p-5 space-y-2"
        >
          {/* Profile Photo */}
          <div className="flex justify-center">
            <label className="relative cursor-pointer">
              <div className="w-32 h-32 rounded-full border-4 border-blue-500 overflow-hidden bg-gray-100 flex items-center justify-center">
                {preview ? (
                  <img
                    src={preview}
                    alt="Doctor"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-500">Photo</span>
                )}
              </div>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block font-medium mb-2">Full Name</label>
              <input
                type="text"
                placeholder="Full Name"
                {...register("fullName", {
                  required: "Full name is required",
                })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.fullName && (
                  <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>
                )}
            </div>

            {/* Specialization */}
            <div>
              <label className="block font-medium mb-2">Specialization</label>
              <input
                type="text"
                placeholder="Cardiologist"
                {...register("specialization", {
                  required: "Specialization is required",
                })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.specialization && (
                  <p className="text-red-500 text-xs mt-1">{errors.specialization.message}</p>
                )}
            </div>

            {/* Qualification */}
            <div>
              <label className="block font-medium mb-2">Qualification</label>
              <input
                type="text"
                placeholder="MBBS, MD"
                {...register("qualification", {
                  required: "Qualification is required",
                })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.qualification && (
                  <p className="text-red-500 text-xs mt-1">{errors.qualification.message}</p>
                )}
            </div>

            {/* Experience */}
            <div>
              <label className="block font-medium mb-2">
                Experience (Years)
              </label>
              <input
                type="number"
                placeholder="10"
                {...register("experience", {
                  required: "Experience is required",
                })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.experience && (
                  <p className="text-red-500 text-xs mt-1">{errors.experience.message}</p>
                )}
            </div>

            {/* Phone */}
            <div>
              <label className="block font-medium mb-2">Phone</label>
              <input
                type="text"
                placeholder="+91 9876543210"
                {...register("phone", {
                  required: "Phone number is required",
                })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
                )}
            </div>

            {/* Hospital */}
            <div>
              <label className="block font-medium mb-2">Hospital</label>
              <input
                type="text"
                placeholder="City Hospital"
                {...register("hospital")}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
          {/* License */}
          <div>
            <label className="block font-medium mb-2">
              Medical License Number
            </label>
            <input
              type="text"
              placeholder="LIC123456"
              {...register("licenseNo")}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.licenseNo && (
                  <p className="text-red-500 text-xs mt-1">{errors.licenseNo.message}</p>
                )}
          </div>

            {/* Consultation Fee */}
            <div>
              <label className="block font-medium mb-2">Consultation Fee</label>
              <input
                type="number"
                placeholder="500"
                {...register("consultationFee")}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.consultationFee && (
                  <p className="text-red-500 text-xs mt-1">{errors.consultationFee.message}</p>
                )}
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block font-medium mb-2">Clinic Address</label>
            <textarea
              rows={4}
              placeholder="Enter clinic address"
              {...register("address")}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Button */}
          <div className="pt-6 text-center">
            <button
              type="submit"
              disabled={loading}
              className={`w-full sm:w-auto px-10 py-2.5 rounded-xl text-white font-semibold shadow-lg transition-all duration-200 flex items-center justify-center gap-2 mx-auto ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 hover:shadow-blue-500/25 active:scale-[0.99]"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{isEditMode ? "Updating Profile..." : "Saving Profile..."}</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>{isEditMode ? "Update Profile" : "Save Profile"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DoctorForm;
