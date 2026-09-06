import prisma from "../lib/prisma.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const getAllDoctors = asyncHandler(async(req, res) => {
  const doctors = await prisma.doctor.findMany({
    select: {
      id: true,
      name: true,
      specialization: true,
      experience: true,
      consultationFee: true
    }
  })
  
  return res
  .status(200)
  .json(
    new ApiResponse(200, doctors, ''))
})

// controllers/search.controller.js
const searchHospitals = asyncHandler(async (req, res) => {
  const { search } = req.query
  const hospitals = await prisma.hospital.findMany({
    where: search ? { name: { contains: search, mode: "insensitive" } } : undefined,
    select: { id: true, name: true, address: true }
  })
  return res.status(200).json(new ApiResponse(200, hospitals, "Hospitals fetched successfully"))
})

export{
  getAllDoctors,
  searchHospitals
}