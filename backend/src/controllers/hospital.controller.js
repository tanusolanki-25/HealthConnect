import prisma from "../lib/prisma.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


const registerHospital = asyncHandler(async (req, res) => {
  const userId = req.user.id
  const {
    name,
    registrationNumber,
    type,
    establishedYear,
    email,
    phone,
    emergencyPhone,
    website,
    address,
    city,
    state,
    pincode,
    country,
    beds,
    doctorsCount,
    departmentsCount,
    openingTime,
    closingTime,
    is24Hours,
    description
  } = req.body
 
  if (!name || !address) {
    throw new ApiError(400, "Name and address are required")
  }
 
  if (req.user.role !== "hospital") {
    throw new ApiError(403, "Only hospital accounts can create a hospital profile")
  }
 
  const existingProfile = await prisma.hospital.findUnique({ where: { userId } })
  if (existingProfile) throw new ApiError(409, "Hospital profile already exists for this user")

  const logoLocalPath = req.files?.logo?.[0]?.path
  const certificateLocalPath = req.files?.certificate?.[0]?.path
 
  let logoUrl = null
  let certificateUrl = null
 
  if (logoLocalPath) {
    const logoUpload = await uploadOnCloudinary(logoLocalPath)
    if (!logoUpload) throw new ApiError(500, "Logo upload failed, please try again")
    logoUrl = logoUpload.url
  }
 
  if (certificateLocalPath) {
    const certUpload = await uploadOnCloudinary(certificateLocalPath)
    if (!certUpload) throw new ApiError(500, "Certificate upload failed, please try again")
    certificateUrl = certUpload.url
  }
 
  const hospital = await prisma.hospital.create({
    data: {
      userId,
      name,
      registrationNumber: registrationNumber || null,
      type: type || null,
      establishedYear: establishedYear ? Number(establishedYear) : null,
      email: email || null,
      phone: phone || null,
      emergencyPhone: emergencyPhone || null,
      website: website || null,
      address,
      city: city || null,
      state: state || null,
      pincode: pincode || null,
      country: country || "India",
      beds: beds ? Number(beds) : null,
      doctorsCount: doctorsCount ? Number(doctorsCount) : null,
      departmentsCount: departmentsCount ? Number(departmentsCount) : null,
      openingTime: openingTime || null,
      closingTime: closingTime || null,
      is24Hours: !!is24Hours,
      description: description || null,
      logoUrl,
      certificateUrl
    }
  })
 
  return res.status(201).json(new ApiResponse(201, hospital, "Hospital registered successfully"))
})
 
const updateHospitalAccount = asyncHandler(async (req, res) => {
  if (req.user.role !== "hospital") {
    throw new ApiError(403, "Only hospital accounts can update this profile")
  }
 
  const {
    name,
    registrationNumber,
    type,
    establishedYear,
    email,
    phone,
    emergencyPhone,
    website,
    address,
    city,
    state,
    pincode,
    country,
    beds,
    doctorsCount,
    departmentsCount,
    openingTime,
    closingTime,
    is24Hours,
    description
  } = req.body
 
  const updateData  = await prisma.hospital.update({
    where: { userId: req.user.id },
    data: {
      name,
      registrationNumber,
      type,
      establishedYear: establishedYear ? Number(establishedYear) : undefined,
      email,
      phone,
      emergencyPhone,
      website,
      address,
      city,
      state,
      pincode,
      country,
      beds: beds ? Number(beds) : undefined,
      doctorsCount: doctorsCount ? Number(doctorsCount) : undefined,
      departmentsCount: departmentsCount ? Number(departmentsCount) : undefined,
      openingTime,
      closingTime,
      is24Hours,
      description
    }
  })
 
  const logoLocalPath = req.files?.logo?.[0]?.path
  const certificateLocalPath = req.files?.certificate?.[0]?.path
 
  if (logoLocalPath) {
    const logoUpload = await uploadOnCloudinary(logoLocalPath)
    if (!logoUpload) throw new ApiError(500, "Logo upload failed, please try again")
    updateData.logoUrl = logoUpload.url
  }
 
  if (certificateLocalPath) {
    const certUpload = await uploadOnCloudinary(certificateLocalPath)
    if (!certUpload) throw new ApiError(500, "Certificate upload failed, please try again")
    updateData.certificateUrl = certUpload.url
  }
 
  const updated = await prisma.hospital.update({
    where: { userId: req.user.id },
    data: updateData
  })

  return res.status(200).json(new ApiResponse(200, updated, "Hospital profile updated successfully"))
})

const getMyProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id

  if (req.user.role !== "hospital") {
    throw new ApiError(403, "Only hospital accounts can view this profile")
  }

  const hospital = await prisma.hospital.findUnique({
    where: { userId },
    include: {
      doctors: {
        select: { id: true, name: true, specialization: true, licenseNo: true }
      }
    }
  })

  if (!hospital) {
    throw new ApiError(404, "Hospital profile not found")
  }

  return res.status(200).json(new ApiResponse(200, hospital, "Hospital profile fetched successfully"))
})
 
const getAffiliatedDoctors = asyncHandler(async (req, res) => {
  if (req.user.role !== "hospital") {
    throw new ApiError(403, "Only hospital accounts can view affiliated doctors")
  }
 
  const hospital = await prisma.hospital.findUnique({ where: { userId: req.user.id } })
  if (!hospital) throw new ApiError(404, "Hospital profile not found")
 
  const doctors = await prisma.doctor.findMany({
    where: { hospitalId: hospital.id },
    select: { id: true, name: true, specialization: true, licenseNo: true, fileUrl: true, qualification: true,}
  })
 
  return res
    .status(200)
    .json(new ApiResponse(200, doctors, "Affiliated doctors fetched successfully"))
})

const setDoctorStatus = asyncHandler(async (req, res) => {
  if (req.user.role !== "doctor") {
    throw new ApiError(403, "Only doctor accounts can update their status")
  }
 
  const { status } = req.body
 
  if (!["available", "busy", "on_leave"].includes(status)) {
    throw new ApiError(400, "status must be 'available', 'busy', or 'on_leave'")
  }
 
  const updated = await prisma.doctor.update({
    where: { userId: req.user.id },
    data: { status }
  })
 
  return res.status(200).json(new ApiResponse(200, updated, "Status updated successfully"))
})

const getDoctorDetails = asyncHandler(async (req, res) => {
  if (req.user.role !== "hospital") {
    throw new ApiError(403, "Only hospital accounts can view doctor details")
  }
 
  const hospital = await prisma.hospital.findUnique({ where: { userId: req.user.id } })
  if (!hospital) throw new ApiError(404, "Hospital profile not found")
 
  const doctor = await prisma.doctor.findUnique({
    where: { id: req.params.doctorId },
    select: {
      id: true,
      name: true,
      specialization: true,
      licenseNo: true,
      fileUrl: true,
      hospitalId: true,
      phone: true,
      user: { select: { email: true, createdAt: true } },
      _count: {
        select: { appointments: true, prescriptions: true }
      }
    }
})
if (!doctor || doctor.hospitalId !== hospital.id) {
    throw new ApiError(404, "Doctor is not affiliated with your hospital")
  }
 
  return res
    .status(200)
    .json(new ApiResponse(200, doctor, "Doctor details fetched successfully"))
})

const removeDoctorAffiliation = asyncHandler(async (req, res) => {
  if (req.user.role !== "hospital") {
    throw new ApiError(403, "Only hospital accounts can remove a doctor's affiliation")
  }
 
  const hospital = await prisma.hospital.findUnique({ where: { userId: req.user.id } })
  if (!hospital) throw new ApiError(404, "Hospital profile not found")
 
  const doctor = await prisma.doctor.findUnique({ where: { id: req.params.doctorId } })
  if (!doctor || doctor.hospitalId !== hospital.id) {
    throw new ApiError(404, "Doctor is not affiliated with your hospital")
  }
 
  const updated = await prisma.doctor.update({
    where: { id: req.params.doctorId },
    data: { hospitalId: null }
  })
 
  return res
    .status(200)
    .json(new ApiResponse(200, updated, "Doctor affiliation removed"))
})
 
const getHospitalAppointments = asyncHandler(async (req, res) => {
  if (req.user.role !== "hospital") {
    throw new ApiError(403, "Only hospital accounts can view hospital appointments")
  }
 
  const hospital = await prisma.hospital.findUnique({ where: { userId: req.user.id } })
  if (!hospital) throw new ApiError(404, "Hospital profile not found")
 
  const { status } = req.query // optional filter: booked | completed | cancelled
 
  const appointments = await prisma.appointment.findMany({
    where: {
      OR: [
        { hospitalId: hospital.id },
        { doctor: { hospitalId: hospital.id } }
      ],
      ...(status ? { status } : {})
    },
    include: {
      patient: {
        select: {
          id: true,
          name: true,
          phone: true,
          gender: true,
          allergies: true,
          address: true
        }
      },
      doctor: {
        select: {
          id: true,
          name: true,
          specialization: true,
          phone: true,
          qualification: true
        }
      }
    },
    orderBy: { scheduledAt: "asc" }
  })
 
  return res
    .status(200)
    .json(new ApiResponse(200, appointments, "Hospital appointments fetched successfully"))
})


const updateHospitalAppointmentStatus = asyncHandler(async (req, res) => {
  if (req.user.role !== "hospital") {
    throw new ApiError(403, "Only hospital accounts can update appointment status")
  }

  const { status } = req.body
  if (!["booked", "completed", "cancelled"].includes(status)) {
    throw new ApiError(400, "Invalid status. Must be booked, completed, or cancelled")
  }

  const hospital = await prisma.hospital.findUnique({ where: { userId: req.user.id } })
  if (!hospital) throw new ApiError(404, "Hospital profile not found")

  const appointment = await prisma.appointment.findUnique({
    where: { id: req.params.id },
    include: { doctor: true }
  })

  if (!appointment || (appointment.hospitalId !== hospital.id && appointment.doctor?.hospitalId !== hospital.id)) {
    throw new ApiError(404, "Appointment not found for this hospital")
  }

  const updated = await prisma.appointment.update({
    where: { id: req.params.id },
    data: { status }
  })

  return res.status(200).json(new ApiResponse(200, updated, "Appointment status updated"))
})

export {
  registerHospital,
  getMyProfile,
  updateHospitalAccount,
  getAffiliatedDoctors,
  removeDoctorAffiliation,
  getHospitalAppointments,
  updateHospitalAppointmentStatus,
  getDoctorDetails,
  setDoctorStatus
}
 