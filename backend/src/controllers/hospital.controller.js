import prisma from "../lib/prisma.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { hasAccess } from "../utils/hasAccess.js";


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
    select: { id: true, name: true, specialization: true, licenseNo: true }
  })
 
  return res
    .status(200)
    .json(new ApiResponse(200, doctors, "Affiliated doctors fetched successfully"))
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
      hospitalId: hospital.id,
      ...(status ? { status } : {})
    },
    include: {
      patient: { select: { name: true, contact: true } },
      doctor: { select: { name: true, specialization: true } }
    },
    orderBy: { scheduledAt: "asc" }
  })
 
  return res
    .status(200)
    .json(new ApiResponse(200, appointments, "Hospital appointments fetched successfully"))
})
 
const getHospitalRecords = asyncHandler(async (req, res) => {
  if (req.user.role !== "hospital") {
    throw new ApiError(403, "Only hospital accounts can view hospital records")
  }
 
  const hospital = await prisma.hospital.findUnique({ where: { userId: req.user.id } })
  if (!hospital) throw new ApiError(404, "Hospital profile not found")
 
  const records = await prisma.medicalRecord.findMany({
    where: { hospitalId: hospital.id },
    include: {
      patient: { select: { name: true } },
      doctor: { select: { name: true } }
    },
    orderBy: { uploadDate: "desc" }
  })
 
  return res
    .status(200)
    .json(new ApiResponse(200, records, "Hospital records fetched successfully"))
})

const uploadRecordForPatient = asyncHandler(async (req, res) => {
  if (req.user.role !== "doctor") {
    throw new ApiError(403, "Only doctor accounts can use this endpoint")
  }
 
  const { patientId, recordType } = req.body
  const localFilePath = req.file?.path
 
  if (!patientId || !recordType) {
    throw new ApiError(400, "patientId and recordType are required")
  }
 
  if (!localFilePath) {
    throw new ApiError(400, "File is required")
  }
 
  const doctor = await prisma.doctor.findUnique({ where: { userId: req.user.id } })
  if (!doctor) {
    throw new ApiError(404, "Doctor profile not found")
  }
 
  const allowed = await hasAccess(doctor.id, patientId)
  if (!allowed) {
    throw new ApiError(403, "Access denied. Request permission from the patient first.")
  }
 
  const cloudinaryResponse = await uploadOnCloudinary(localFilePath)
  if (!cloudinaryResponse) {
    throw new ApiError(500, "File upload failed, please try again")
  }
 
  const record = await prisma.medicalRecord.create({
    data: {
      patientId,
      doctorId: doctor.id,
      hospitalId: doctor.hospitalId,
      recordType,
      fileUrl: cloudinaryResponse.url
    }
  })
 
  return res
    .status(201)
    .json(new ApiResponse(201, record, "Medical record uploaded successfully"))
})
 
const viewPatientRecords = asyncHandler(async (req, res) => {
  if (req.user.role !== "doctor") {
    throw new ApiError(403, "Only doctor accounts can use this endpoint")
  }
 
  const { patientId } = req.params
 
  const doctor = await prisma.doctor.findUnique({ where: { userId: req.user.id } })
  if (!doctor) throw new ApiError(404, "Doctor profile not found")
 
  const allowed = await hasAccess(doctor.id, patientId)
  if (!allowed) {
    throw new ApiError(403, "Access denied. Request permission from the patient first.")
  }
 
  const records = await prisma.medicalRecord.findMany({
    where: { patientId },
    orderBy: { uploadDate: "desc" }
  })
 
  return res
    .status(200)
    .json(new ApiResponse(200, records, "Patient records fetched successfully"))
})

export {
  registerHospital,
  getMyProfile,
  updateHospitalAccount,
  getAffiliatedDoctors,
  removeDoctorAffiliation,
  getHospitalAppointments,
  getHospitalRecords,
  uploadRecordForPatient,
  viewPatientRecords
}
 