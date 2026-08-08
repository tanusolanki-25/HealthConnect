import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../api/axios'


import { useAuth } from '../context/AuthContext'

function HospitlForm() {
  const { register, handleSubmit } = useForm()
  const navigate = useNavigate()
  const { markProfileCompleted } = useAuth()

    const onSubmit = async (data) => {
      try {
        await api.post("/hospital/profile", data)
        toast.success("Profile saved successfully")
        markProfileCompleted()
        navigate("/hospital/dashboard")
      } catch (err) {
        toast.error(err.response?.data?.message || "Could not save profile")
      }
    }

  return (
      <div className="min-h-screen bg-[#f5f7ff] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Card */}
      <div className="relative z-10 bg-white rounded-2xl shadow-md w-full max-w-md p-4 mt-10">
        <div className="flex items-center gap-2 text-blue-600 font-bold text-xl mb-2">
          <img src="/favicon.png" alt="logo" className="w-12 h-12" />
          <span>HealthConnect</span>
        </div>

        <h2 className="text-4xl font-bold p-2">Enter Hospital Details</h2>

        <p className="text-gray-500 p-2">
          Complete your hospital profile
        </p>
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm mx-auto mt-2 space-y-4">
       <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
             Name
            </label>
            <div className="flex items-center rounded-lg border border-gray-300 py-3 focus-within:border-blue-600">
              <input
                {...register("name")} 
                placeholder="Hospital name" 
                type="text"
                className="ml-3 w-full outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Address
            </label>
            <div className="flex items-center rounded-lg border border-gray-300 py-3 focus-within:border-blue-600">
              <input
               {...register("address")} 
                placeholder="Address"
                type='textarea'
                className="ml-3 w-full outline-none"
              />
            </div>
          </div>

            <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Registration No.
            </label>
            <div className="flex items-center rounded-lg border border-gray-300 py-3 focus-within:border-blue-600">
              <input
                {...register("registrationNo")} placeholder="Registration number (optional)"
                type="number"
                className="ml-3 w-full outline-none"
              />
            </div>
          </div>
       <button className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 font-semibold flex items-center justify-center gap-2 transition">
            Save
          </button>
      </form>
      </div>
    </div>
  )
}

export default HospitlForm
