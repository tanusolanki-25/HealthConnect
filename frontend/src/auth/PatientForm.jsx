import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

import {
  User,
  Phone,
  Mail,
  ShieldAlert,
  HeartPulse,
  Save,
  ChevronDown,
  ArrowLeft,
  Loader2
} from "lucide-react";

function PatientForm() {
  const { user, markProfileCompleted } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      dob: "",
      gender: "Female",
      bloodGroup: "O+",
      phone: "",
      email: user?.email || "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      emergencyRelationship: "Father",
      height: "",
      weight: "",
      allergies: "None",
      existingDiseases: "None",
    },
  });

  // Fetch existing profile on mount to pre-fill form for edit mode
  useEffect(() => {
    const fetchPatientProfile = async () => {
      try {
        const res = await api.get("/patient/profile");
        const profile = res.data.data;

        if (profile) {
          setIsEditMode(true);
          
          // Split full name into first and last name
          const nameParts = (profile.name || "").trim().split(" ");
          const firstName = nameParts[0] || "";
          const lastName = nameParts.slice(1).join(" ") || "";

          // Format DOB for HTML date input (YYYY-MM-DD)
          let formattedDob = "";
          if (profile.dob) {
            formattedDob = new Date(profile.dob).toISOString().split("T")[0];
          }

          reset({
            firstName,
            lastName,
            dob: formattedDob,
            gender: profile.gender || "Female",
            bloodGroup: profile.bloodGroup || "O+",
            phone: profile.phone || "",
            email: user?.email || "",
            address: profile.address || "",
            city: profile.city || "",
            state: profile.state || "",
            pincode: profile.pincode || "",
            emergencyContactName: profile.emergencyContactName || "",
            emergencyContactPhone: profile.emergencyContactPhone || "",
            emergencyRelationship: profile.relationship || "Father",
            height: profile.height || "",
            weight: profile.weight || "",
            allergies: profile.allergies || "None",
            existingDiseases: profile.existingDiseases || "None",
          });
        }
      } catch (error) {
        // If 404, user has no profile yet -> create mode
        setIsEditMode(false);
      } finally {
        setFetching(false);
      }
    };

    fetchPatientProfile();
  }, [reset, user?.email]);

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      let formattedContact = formData.phone?.trim() || "";
      if (formattedContact) {
        const digits = formattedContact.replace(/\D/g, "");
        if (digits.length === 10) {
          formattedContact = `+91${digits}`;
        } else if (digits.length === 12 && digits.startsWith("91")) {
          formattedContact = `+${digits}`;
        }
      }

      const payload = {
        name: `${formData.firstName || ""} ${formData.lastName || ""}`.trim(),
        dob: formData.dob,
        gender: formData.gender,
        bloodGroup: formData.bloodGroup,
        phone: formattedContact,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        emergencyContactName: formData.emergencyContactName,
        emergencyContactPhone: formData.emergencyContactPhone,
        emergencyRelationship: formData.emergencyRelationship,
        height: formData.height,
        weight: formData.weight,
        allergies: formData.allergies,
        existingDiseases: formData.existingDiseases,
      };

      if (isEditMode) {
        // Update existing profile
        await api.patch("/patient/update-profile", payload);
        toast.success("Profile updated successfully!");
      } else {
        // Create new profile
        await api.post("/patient/profile", payload);
        toast.success("Profile created successfully!");
        markProfileCompleted();
      }

      navigate("/patient/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not save profile");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          <p className="text-gray-600 text-sm font-medium">Loading profile details...</p>
        </div>
      </div>
    );
  }

  return (
     <div className="h-[calc(100vh-4rem)] overflow-y-auto bg-slate-50 px-4 py-2 flex justify-center items-start hide-scrollbar">
      <div className="w-full max-w-3xl bg-white rounded shadow-xl border border-gray-200 overflow-hidden ">
        
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-teal-600 p-4 sm:p-4 text-white text-center relative">
          {isEditMode && (
            <Link
              to="/patient/dashboard"
              className="absolute top-6 left-6 inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg text-xs font-semibold backdrop-blur-sm transition"
            >
              <ArrowLeft size={14} />
              <span>Back to Dashboard</span>
            </Link>
          )}

          <div className="w-12 h-12 mx-auto bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-2xl border border-white/30 shadow-inner mb-3">
            👤
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {isEditMode ? "Edit Patient Profile" : "Complete Patient Profile"}
          </h1>
          <p className="text-blue-100 text-xs sm:text-sm mt-1 font-medium">
            {isEditMode
              ? "Update your personal and medical information below"
              : "Complete your information to get started"}
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 sm:p-6 space-y-4">
          
          {/* SECTION 1: Personal Information */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 border-b border-gray-200 pb-2 text-gray-800 font-bold text-lg">
              <User className="w-5 h-5 text-blue-600" />
              <span>Personal Information</span>
            </div>

            {/* First Name & Last Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <div className="relative rounded-xl border border-gray-300 bg-gray-50/50 focus-within:bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                  <input
                    type="text"
                    placeholder="First Name"
                    {...register("firstName", { required: "First name is required" })}
                    className="w-full px-3.5 py-2.5 bg-transparent text-sm text-gray-800 outline-none rounded-xl"
                  />
                </div>
                {errors.firstName && (
                  <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <div className="relative rounded-xl border border-gray-300 bg-gray-50/50 focus-within:bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                  <input
                    type="text"
                    placeholder="Last Name"
                    {...register("lastName", { required: "Last name is required" })}
                    className="w-full px-3.5 py-2.5 bg-transparent text-sm text-gray-800 outline-none rounded-xl"
                  />
                </div>
                {errors.lastName && (
                  <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            {/* Date of Birth & Gender */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center rounded-xl border border-gray-300 bg-gray-50/50 focus-within:bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all px-3 py-2">
                  <span className="mr-2 text-base">📅</span>
                  <input
                    type="date"
                    {...register("dob", { required: "Date of birth is required" })}
                    className="w-full bg-transparent text-sm text-gray-800 outline-none"
                  />
                </div>
                {errors.dob && (
                  <p className="text-red-500 text-xs mt-1">{errors.dob.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Gender <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center rounded-xl border border-gray-300 bg-gray-50/50 focus-within:bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all px-3 py-2">
                  <select
                    {...register("gender", { required: "Gender is required" })}
                    className="w-full bg-transparent text-sm text-gray-800 outline-none cursor-pointer appearance-none pr-6"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 pointer-events-none" />
                </div>
                {errors.gender && (
                  <p className="text-red-500 text-xs mt-1">{errors.gender.message}</p>
                )}
              </div>
            </div>

            {/* Blood Group & Phone Number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Blood Group
                </label>
                <div className="relative flex items-center rounded-xl border border-gray-300 bg-gray-50/50 focus-within:bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all px-3 py-2">
                  <select
                    {...register("bloodGroup")}
                    className="w-full bg-transparent text-sm text-gray-800 outline-none cursor-pointer appearance-none pr-6"
                  >
                    <option value="O+">O+</option>
                    <option value="A+">A+</option>
                    <option value="B+">B+</option>
                    <option value="AB+">AB+</option>
                    <option value="O-">O-</option>
                    <option value="A-">A-</option>
                    <option value="B-">B-</option>
                    <option value="AB-">AB-</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center rounded-xl border border-gray-300 bg-gray-50/50 focus-within:bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all px-3 py-2.5">
                  <Phone className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                  <input
                    type="tel"
                    placeholder="+91 9876543210"
                    {...register("phone", { required: "Phone number is required" })}
                    className="w-full bg-transparent text-sm text-gray-800 outline-none"
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 2: Contact Information */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 border-b border-gray-200 pb-2 text-gray-800 font-bold text-lg">
              <Mail className="w-5 h-5 text-blue-600" />
              <span>Contact Information</span>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Email
              </label>
              <div className="relative flex items-center rounded-xl border border-gray-300 bg-gray-100/70 px-3 py-2.5">
                <span className="mr-2 text-base">✉</span>
                <input
                  type="email"
                  readOnly
                  {...register("email")}
                  className="w-full bg-transparent text-sm text-gray-600 outline-none cursor-not-allowed"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Address
              </label>
              <div className="relative flex items-center rounded-xl border border-gray-300 bg-gray-50/50 focus-within:bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all px-3 py-2.5">
                <span className="mr-2 text-base">🏠</span>
                <input
                  type="text"
                  placeholder="Enter your address..."
                  {...register("address")}
                  className="w-full bg-transparent text-sm text-gray-800 outline-none"
                />
              </div>
            </div>

            {/* City, State, Pincode */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  City
                </label>
                <div className="relative rounded-xl border border-gray-300 bg-gray-50/50 focus-within:bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                  <input
                    type="text"
                    placeholder="City"
                    {...register("city")}
                    className="w-full px-3.5 py-2.5 bg-transparent text-sm text-gray-800 outline-none rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  State
                </label>
                <div className="relative rounded-xl border border-gray-300 bg-gray-50/50 focus-within:bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                  <input
                    type="text"
                    placeholder="State"
                    {...register("state")}
                    className="w-full px-3.5 py-2.5 bg-transparent text-sm text-gray-800 outline-none rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Pincode
                </label>
                <div className="relative rounded-xl border border-gray-300 bg-gray-50/50 focus-within:bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                  <input
                    type="text"
                    placeholder="Pincode"
                    {...register("pincode")}
                    className="w-full px-3.5 py-2.5 bg-transparent text-sm text-gray-800 outline-none rounded-xl"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: Emergency Contact */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 border-b border-gray-200 pb-2 text-gray-800 font-bold text-lg">
              <ShieldAlert className="w-5 h-5 text-blue-600" />
              <span>Emergency Contact</span>
            </div>

            {/* Contact Name & Phone Number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Contact Name
                </label>
                <div className="relative rounded-xl border border-gray-300 bg-gray-50/50 focus-within:bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                  <input
                    type="text"
                    placeholder="Contact Person Name"
                    {...register("emergencyContactName")}
                    className="w-full px-3.5 py-2.5 bg-transparent text-sm text-gray-800 outline-none rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Phone Number
                </label>
                <div className="relative flex items-center rounded-xl border border-gray-300 bg-gray-50/50 focus-within:bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all px-3 py-2.5">
                  <Phone className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                  <input
                    type="tel"
                    placeholder="+91 98xxxxxxx"
                    {...register("emergencyContactPhone")}
                    className="w-full bg-transparent text-sm text-gray-800 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Relationship */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Relationship
              </label>
              <div className="relative flex items-center rounded-xl border border-gray-300 bg-gray-50/50 focus-within:bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all px-3 py-2">
                <select
                  {...register("emergencyRelationship")}
                  className="w-full bg-transparent text-sm text-gray-800 outline-none cursor-pointer appearance-none pr-6"
                >
                  <option value="Father">Father</option>
                  <option value="Mother">Mother</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Guardian">Guardian</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Friend">Friend</option>
                  <option value="Other">Other</option>
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* SECTION 4: Medical Information */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 border-b border-gray-200 pb-2 text-gray-800 font-bold text-lg">
              <HeartPulse className="w-5 h-5 text-blue-600" />
              <span>Medical Information</span>
            </div>

            {/* Height & Weight */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Height (cm)
                </label>
                <div className="relative rounded-xl border border-gray-300 bg-gray-50/50 focus-within:bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                  <input
                    type="number"
                    placeholder="165"
                    {...register("height")}
                    className="w-full px-3.5 py-2.5 bg-transparent text-sm text-gray-800 outline-none rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Weight (kg)
                </label>
                <div className="relative rounded-xl border border-gray-300 bg-gray-50/50 focus-within:bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                  <input
                    type="number"
                    placeholder="58"
                    {...register("weight")}
                    className="w-full px-3.5 py-2.5 bg-transparent text-sm text-gray-800 outline-none rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Allergies */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Allergies
              </label>
              <div className="relative rounded-xl border border-gray-300 bg-gray-50/50 focus-within:bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                <input
                  type="text"
                  placeholder="None"
                  {...register("allergies")}
                  className="w-full px-3.5 py-2.5 bg-transparent text-sm text-gray-800 outline-none rounded-xl"
                />
              </div>
            </div>

            {/* Existing Diseases */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Existing Diseases
              </label>
              <div className="relative rounded-xl border border-gray-300 bg-gray-50/50 focus-within:bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                <input
                  type="text"
                  placeholder="None"
                  {...register("existingDiseases")}
                  className="w-full px-3.5 py-2.5 bg-transparent text-sm text-gray-800 outline-none rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6 text-center">
            <button
              type="submit"
              disabled={loading}
              className={`w-full sm:w-auto px-10 py-3.5 rounded-xl text-white font-semibold shadow-lg transition-all duration-200 flex items-center justify-center gap-2 mx-auto ${
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

export default PatientForm;
