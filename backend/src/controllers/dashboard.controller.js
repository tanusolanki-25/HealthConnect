import prisma from "../lib/prisma.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

// doctor's full dashboard — everything linked to them, in one call
const getDoctorDashboard = asyncHandler(async (req, res) => {
  if (req.user.role !== "doctor") {
    throw new ApiError(403, "Only doctor accounts can view this dashboard")
  }

  const doctor = await prisma.doctor.findUnique({
    where: { userId: req.user.id },
    include: {
      hospital: { select: { name: true } },
      appointments: { include: { patient: { select: { name: true } } }, orderBy: { scheduledAt: "asc" } },
      prescriptions: { include: { patient: { select: { name: true } } }, orderBy: { issuedDate: "desc" } },
      permissions: { include: { patient: { select: { name: true } } }, orderBy: { createdAt: "desc" } }
    }
  })

  if (!doctor) throw new ApiError(404, "Doctor profile not found")

  return res
    .status(200)
    .json(new ApiResponse(200, doctor, "Dashboard fetched successfully"))
})

const getPatientDashboard = asyncHandler(async (req, res) => {
  if (req.user.role !== "patient") {
    throw new ApiError(403, "Only patient accounts can view this dashboard")
  }

  const patient = await prisma.patient.findUnique({
    where: { userId: req.user.id },
    include: {
      appointments: {
        include: { doctor: { select: { name: true, specialization: true } } },
        orderBy: { scheduledAt: "asc" }
      },
      prescriptions: {
        include: { doctor: { select: { name: true, specialization: true } } },
        orderBy: { issuedDate: "desc" }
      },
      permissions: {
        include: { doctor: { select: { name: true, specialization: true } } },
        orderBy: { createdAt: "desc" }
      },
      records: {
        include: {
          doctor: { select: { name: true } },
          hospital: { select: { name: true } }
        },
        orderBy: { uploadDate: "desc" }
      }
    }
  })

  if (!patient) {
    throw new ApiError(404, "Patient profile not found. Please complete your profile first.")
  }

  return res
    .status(200)
    .json(new ApiResponse(200, patient, "Dashboard fetched successfully"))
})

const getHospitalDashboard = asyncHandler(async (req, res) => {
  if (req.user.role !== "hospital") {
    throw new ApiError(403, "Only hospital accounts can view this dashboard")
  }

  const hospital = await prisma.hospital.findUnique({
    where: { userId: req.user.id },
    include: {
      doctors: { select: { id: true, name: true, specialization: true } },
      appointments: {
        include: {
          patient: { select: { name: true } },
          doctor: { select: { name: true } }
        },
        orderBy: { scheduledAt: "asc" }
      },
      records: {
        include: {
          patient: { select: { name: true } },
          doctor: { select: { name: true } }
        },
        orderBy: { uploadDate: "desc" }
      }
    }
  })

  if (!hospital) {
    throw new ApiError(404, "Hospital profile not found")
  }

  return res
    .status(200)
    .json(new ApiResponse(200, hospital, "Hospital dashboard fetched successfully"))
})


export { getDoctorDashboard, getPatientDashboard, getHospitalDashboard }