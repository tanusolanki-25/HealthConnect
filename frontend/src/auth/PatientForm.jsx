import React, { useState } from "react";
import { useForm } from "react-hook-form";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext";

function PatientForm({ onDone }) {
  const { register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { markProfileCompleted } = useAuth();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await api.post("/patient/profile", data);
      toast.success("Profile saved successfully");
      markProfileCompleted();
      navigate("/patient/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not save profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Card */}
      <div className="relative z-10 bg-white rounded-2xl shadow-md w-full max-w-md p-4 m-4">
        <div className="flex items-center gap-2 text-blue-600 font-bold text-xl mb-2">
          <img src="/favicon.png" alt="logo" className="w-12 h-12" />
          <span>HealthConnect</span>
        </div>
        <h2 className="text-4xl font-bold p-2">Enter Patient Details</h2>
        <p className="text-gray-500 p-2">Complete your patient profile</p>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="max-w-sm mx-auto mt-2 space-y-4"
        >
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <div className="flex items-center rounded-lg border border-gray-300 py-3 focus-within:border-blue-600">
              <input
                {...register("name")}
                type="name"
                placeholder="Mr. Rahul Kumar"
                className="ml-3 w-full outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              D.O.B
            </label>
            <div className="flex items-center rounded-lg border border-gray-300 py-3 focus-within:border-blue-600">
              <input
                {...register("dob")}
                type="date"
                className="ml-3 w-full outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Gender
            </label>
            <div className="flex items-center rounded-lg border border-gray-300 py-3 focus-within:border-blue-600">
              <select
                {...register("gender")}
                className="ml-3 w-full outline-none"
              >
                <option value="">Select gender</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              BloodGroup
            </label>
            <div className="flex items-center rounded-lg border border-gray-300 py-3 focus-within:border-blue-600">
              <input
                {...register("bloodGroup")}
                placeholder="Blood group (optional)"
                type="bloodGroup"
                className="ml-3 w-full outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Contact Number
            </label>
            <div className="flex items-center rounded-lg border border-gray-300 py-3 focus-within:border-blue-600">
              <input
                {...register("contact")}
                placeholder="Contact number"
                type="contact number"
                className="ml-3 w-full outline-none"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`flex w-full items-center justify-center gap-2 rounded-lg p-3 ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-cyan-500 hover:scale-105 hover:shadow-xl"
            }`}
          >
            {loading ? "loading..." : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PatientForm;
