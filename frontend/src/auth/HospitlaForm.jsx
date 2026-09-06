import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import {
  ArrowLeft,
  Loader2,
  Save,
  Building2,
  Phone,
  MapPin,
  Clock,
  FileText,
  ChevronDown,
  Globe,
  BedDouble,
  Stethoscope,
  LayoutGrid,
} from "lucide-react";

function HospitlForm() {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      registrationNumber: "",
      type: "",
      establishedYear: "",
      email: "",
      phone: "",
      emergencyPhone: "",
      website: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
      beds: "",
      doctorsCount: "",
      departmentsCount: "",
      openingTime: "",
      closingTime: "",
      is24Hours: false,
      description: "",
    },
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [logoFile, setLogoFile] = useState(null);
  const [certificateFile, setCertificateFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const navigate = useNavigate();
  const { markProfileCompleted, user } = useAuth();

  const is24Hours = watch("is24Hours");

  useEffect(() => {
    const fetchHospitalProfile = async () => {
      try {
        const res = await api.get("/hospital/profile");
        const profile = res.data.data;
        if (profile) {
          setIsEditMode(true);
          if (profile.logoUrl) setLogoPreview(profile.logoUrl);
          reset({
            name: profile.name || "",
            registrationNumber: profile.registrationNumber || "",
            type: profile.type || "",
            establishedYear: profile.establishedYear || "",
            email: profile.email || "",
            phone: profile.phone || "",
            emergencyPhone: profile.emergencyPhone || "",
            website: profile.website || "",
            address: profile.address || "",
            city: profile.city || "",
            state: profile.state || "",
            pincode: profile.pincode || "",
            country: profile.country || "India",
            beds: profile.beds || "",
            doctorsCount: profile.doctorsCount || "",
            departmentsCount: profile.departmentsCount || "",
            openingTime: profile.openingTime || "",
            closingTime: profile.closingTime || "",
            is24Hours: profile.is24Hours || false,
            description: profile.description || "",
          });
        }
      } catch {
        setIsEditMode(false);
      } finally {
        setFetching(false);
      }
    };
    fetchHospitalProfile();
  }, [reset, user?.email]);

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, val]) => {
        if (val !== undefined && val !== null) payload.append(key, val);
      });
      if (logoFile) payload.append("logo", logoFile);
      if (certificateFile) payload.append("certificate", certificateFile);

      if (isEditMode) {
        await api.patch("/hospital/update-profile", payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Profile updated successfully!");
      } else {
        await api.post("/hospital/profile", payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Hospital profile created successfully!");
        markProfileCompleted();
      }
      navigate("/hospital/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not save profile");
    } finally {
      setLoading(false);
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
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
      <div className="w-full max-w-3xl bg-white rounded shadow-xl border border-gray-200 overflow-hidden">

        {/* ── Header ── */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-teal-600 p-4 text-white text-center relative">
          {isEditMode && (
            <Link
              to="/hospital/dashboard"
              className="absolute top-6 left-6 inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg text-xs font-semibold backdrop-blur-sm transition"
            >
              <ArrowLeft size={14} />
              <span>Back to Dashboard</span>
            </Link>
          )}

          {/* Logo preview / upload */}
          <label className="cursor-pointer inline-block">
            <div className="w-16 h-16 mx-auto rounded-2xl border-2 border-white/40 bg-white/20 backdrop-blur-md flex items-center justify-center overflow-hidden mb-3 shadow-inner">
              {logoPreview ? (
                <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl">🏥</span>
              )}
            </div>
            <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
            <p className="text-xs text-blue-100 mb-1">Click to upload logo</p>
          </label>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {isEditMode ? "Edit Hospital Profile" : "Complete Hospital Profile"}
          </h1>
          <p className="text-blue-100 text-xs sm:text-sm mt-1 font-medium">
            {isEditMode
              ? "Update your hospital information below"
              : "Fill in your hospital details to get started"}
          </p>
        </div>

        {/* ── Form ── */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">

          {/* SECTION 1 — Basic Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-200 pb-2 text-gray-800 font-bold text-lg">
              <Building2 className="w-5 h-5 text-blue-600" />
              <span>Basic Information</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Hospital Name */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Hospital Name <span className="text-red-500">*</span>
                </label>
                <div className="rounded-xl border border-gray-300 bg-gray-50/50 focus-within:bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                  <input
                    type="text"
                    placeholder="e.g. City General Hospital"
                    {...register("name", { required: "Hospital name is required" })}
                    className="w-full px-3.5 py-2.5 bg-transparent text-sm text-gray-800 outline-none rounded-xl"
                  />
                </div>
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>

              {/* Registration Number */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Registration Number <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <div className="flex items-center rounded-xl border border-gray-300 bg-gray-50/50 focus-within:bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all px-3 py-2.5">
                  <FileText className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="e.g. HOSP-MH-2024-0123"
                    {...register("registrationNumber")}
                    className="w-full bg-transparent text-sm text-gray-800 outline-none"
                  />
                </div>
              </div>

              {/* Hospital Type */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Hospital Type <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center rounded-xl border border-gray-300 bg-gray-50/50 focus-within:bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all px-3 py-2">
                  <select
                    {...register("type", { required: "Hospital type is required" })}
                    className="w-full bg-transparent text-sm text-gray-800 outline-none cursor-pointer appearance-none pr-6"
                  >
                    <option value="">Select type</option>
                    <option value="Government">Government</option>
                    <option value="Private">Private</option>
                    <option value="Trust">Trust</option>
                    <option value="Clinic">Clinic</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 pointer-events-none" />
                </div>
                {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type.message}</p>}
              </div>

              {/* Established Year */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Established Year
                </label>
                <div className="rounded-xl border border-gray-300 bg-gray-50/50 focus-within:bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                  <input
                    type="number"
                    placeholder="e.g. 1995"
                    {...register("establishedYear")}
                    className="w-full px-3.5 py-2.5 bg-transparent text-sm text-gray-800 outline-none rounded-xl"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2 — Contact Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-200 pb-2 text-gray-800 font-bold text-lg">
              <Phone className="w-5 h-5 text-blue-600" />
              <span>Contact Information</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center rounded-xl border border-gray-300 bg-gray-50/50 focus-within:bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all px-3 py-2.5">
                  <span className="mr-2 text-base">✉</span>
                  <input
                    type="email"
                    placeholder="hospital@email.com"
                    {...register("email", { required: "Email is required" })}
                    className="w-full bg-transparent text-sm text-gray-800 outline-none"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center rounded-xl border border-gray-300 bg-gray-50/50 focus-within:bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all px-3 py-2.5">
                  <Phone className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                  <input
                    type="tel"
                    placeholder="+91 9876543210"
                    {...register("phone", { required: "Phone is required" })}
                    className="w-full bg-transparent text-sm text-gray-800 outline-none"
                  />
                </div>
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
              </div>

              {/* Emergency Phone */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Emergency Phone
                </label>
                <div className="flex items-center rounded-xl border border-gray-300 bg-gray-50/50 focus-within:bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all px-3 py-2.5">
                  <Phone className="w-4 h-4 text-red-400 mr-2 flex-shrink-0" />
                  <input
                    type="tel"
                    placeholder="+91 9800000000"
                    {...register("emergencyPhone")}
                    className="w-full bg-transparent text-sm text-gray-800 outline-none"
                  />
                </div>
              </div>

              {/* Website */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Website
                </label>
                <div className="flex items-center rounded-xl border border-gray-300 bg-gray-50/50 focus-within:bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all px-3 py-2.5">
                  <Globe className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0 " />
                  <input
                    type="url"
                    placeholder="https://myhospital.com"
                    {...register("website")}
                    className="w-full bg-transparent text-sm text-gray-800 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3 — Location */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-200 pb-2 text-gray-800 font-bold text-lg">
              <MapPin className="w-5 h-5 text-blue-600" />
              <span>Location</span>
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Address <span className="text-red-500">*</span>
              </label>
              <div className="rounded-xl border border-gray-300 bg-gray-50/50 focus-within:bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                <textarea
                  rows={2}
                  placeholder="Street address..."
                  {...register("address", { required: "Address is required" })}
                  className="w-full px-3.5 py-2.5 bg-transparent text-sm text-gray-800 outline-none rounded-xl resize-none"
                />
              </div>
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {/* City */}
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1">City</label>
                <div className="rounded-xl border border-gray-300 bg-gray-50/50 focus-within:bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                  <input
                    type="text"
                    placeholder="City"
                    {...register("city")}
                    className="w-full px-3.5 py-2.5 bg-transparent text-sm text-gray-800 outline-none rounded-xl"
                  />
                </div>
              </div>

              {/* State */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">State</label>
                <div className="rounded-xl border border-gray-300 bg-gray-50/50 focus-within:bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                  <input
                    type="text"
                    placeholder="State"
                    {...register("state")}
                    className="w-full px-3.5 py-2.5 bg-transparent text-sm text-gray-800 outline-none rounded-xl"
                  />
                </div>
              </div>

              {/* Pincode */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Pincode</label>
                <div className="rounded-xl border border-gray-300 bg-gray-50/50 focus-within:bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                  <input
                    type="text"
                    placeholder="400001"
                    {...register("pincode")}
                    className="w-full px-3.5 py-2.5 bg-transparent text-sm text-gray-800 outline-none rounded-xl"
                  />
                </div>
              </div>

              {/* Country */}
              <div className="col-span-2 sm:col-span-4">
                <label className="block text-xs font-semibold text-gray-700 mb-1">Country</label>
                <div className="rounded-xl border border-gray-300 bg-gray-50/50 focus-within:bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                  <input
                    type="text"
                    placeholder="India"
                    {...register("country")}
                    className="w-full px-3.5 py-2.5 bg-transparent text-sm text-gray-800 outline-none rounded-xl"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 4 — Capacity & Departments */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-200 pb-2 text-gray-800 font-bold text-lg">
              <BedDouble className="w-5 h-5 text-blue-600" />
              <span>Capacity &amp; Departments</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Beds */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Total Beds
                </label>
                <div className="flex items-center rounded-xl border border-gray-300 bg-gray-50/50 focus-within:bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all px-3 py-2.5">
                  <BedDouble className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                  <input
                    type="number"
                    placeholder="500"
                    {...register("beds")}
                    className="w-full bg-transparent text-sm text-gray-800 outline-none"
                  />
                </div>
              </div>

              {/* Doctors Count */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  No. of Doctors
                </label>
                <div className="flex items-center rounded-xl border border-gray-300 bg-gray-50/50 focus-within:bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all px-3 py-2.5">
                  <Stethoscope className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                  <input
                    type="number"
                    placeholder="100"
                    {...register("doctorsCount")}
                    className="w-full bg-transparent text-sm text-gray-800 outline-none"
                  />
                </div>
              </div>

              {/* Departments */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  No. of Departments
                </label>
                <div className="flex items-center rounded-xl border border-gray-300 bg-gray-50/50 focus-within:bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all px-3 py-2.5">
                  <LayoutGrid className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                  <input
                    type="number"
                    placeholder="20"
                    {...register("departmentsCount")}
                    className="w-full bg-transparent text-sm text-gray-800 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 5 — Working Hours */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-200 pb-2 text-gray-800 font-bold text-lg">
              <Clock className="w-5 h-5 text-blue-600" />
              <span>Working Hours</span>
            </div>

            {/* 24x7 Checkbox */}
            <label className="flex items-center gap-3 cursor-pointer w-fit">
              <input
                type="checkbox"
                {...register("is24Hours")}
                className="w-4 h-4 accent-blue-600"
              />
              <span className="text-sm font-semibold text-gray-700">24 × 7 Service</span>
            </label>

            {!is24Hours && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Opening Time
                  </label>
                  <div className="flex items-center rounded-xl border border-gray-300 bg-gray-50/50 focus-within:bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all px-3 py-2.5">
                    <Clock className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                    <input
                      type="time"
                      {...register("openingTime")}
                      className="w-full bg-transparent text-sm text-gray-800 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Closing Time
                  </label>
                  <div className="flex items-center rounded-xl border border-gray-300 bg-gray-50/50 focus-within:bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all px-3 py-2.5">
                    <Clock className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                    <input
                      type="time"
                      {...register("closingTime")}
                      className="w-full bg-transparent text-sm text-gray-800 outline-none"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 6 — About & Documents */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-200 pb-2 text-gray-800 font-bold text-lg">
              <FileText className="w-5 h-5 text-blue-600" />
              <span>About &amp; Documents</span>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Hospital Description
              </label>
              <div className="rounded-xl border border-gray-300 bg-gray-50/50 focus-within:bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                <textarea
                  rows={4}
                  placeholder="Brief description about the hospital, specialties, facilities..."
                  {...register("description")}
                  className="w-full px-3.5 py-2.5 bg-transparent text-sm text-gray-800 outline-none rounded-xl resize-none"
                />
              </div>
            </div>

            {/* File Uploads */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Hospital Logo
                </label>
                <label className="flex flex-col items-center justify-center w-full h-24 rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-500 cursor-pointer bg-gray-50/50 hover:bg-blue-50/30 transition-all">
                  <span className="text-2xl mb-1">🖼️</span>
                  <span className="text-xs text-gray-500">Click to upload logo</span>
                  <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Registration Certificate
                </label>
                <label className="flex flex-col items-center justify-center w-full h-24 rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-500 cursor-pointer bg-gray-50/50 hover:bg-blue-50/30 transition-all">
                  <span className="text-2xl mb-1">📄</span>
                  <span className="text-xs text-gray-500">Click to upload certificate</span>
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    onChange={(e) => setCertificateFile(e.target.files[0])}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2 text-center">
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

export default HospitlForm;
