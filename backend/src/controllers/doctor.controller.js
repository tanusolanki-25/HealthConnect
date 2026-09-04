import prisma from "../lib/prisma.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { hasAccess } from '../utils/hasAccess.js';
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const registerDoctor = asyncHandler(async(req, res)=>{
   const userId = req.user.id
   if(req.user.role !== 'doctor'){
    throw new ApiError(403, 'Only doctor can create a doctor profile')
   }
   
   const {name, specialization, qualification, experience, phone,consultationFee, licenseNo, address, hospitalId} = req.body
   
   console.log(req.body)

   if (!name || !specialization || !licenseNo || !qualification || !consultationFee || !experience) {
    throw new ApiError(400, "Mandatory fields is required");
  }

  const existingProfile = await prisma.doctor.findUnique({
    where:{
      userId
    }
  })

  if (existingProfile){
    throw new ApiError(409, 'Doctor profile is already exists for this user')
  }

  const localFilePath = req.file?.path 
  const cloudinaryResponse = await uploadOnCloudinary(localFilePath)

  if(!cloudinaryResponse){
    throw new ApiError(500, 'File upload failed, please try again')
  }

  const doctor = await prisma.doctor.create({
    data:{
      userId,
      name,
      specialization,
      licenseNo,
      qualification,
      experience,
      hospitalId: hospitalId || null,
      fileUrl: cloudinaryResponse.url,
      phone,
      consultationFee,
      address: address || "",
    }
  })

  return res
  .status(201)
  .json(
    new ApiResponse(201, doctor, 'Doctor created successfully')
  )
})

const getDoctorProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const doctor = await prisma.doctor.findUnique({
    where: { userId },
    include: {
      hospital: {
        select: {
          id: true,
          name: true,
          address: true
        }
      }
    }
  });

  if (!doctor) {
    throw new ApiError(404, "Doctor profile does not exist for this user");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, doctor, "Doctor profile fetched successfully"));
});

const updateDoctorAccount = asyncHandler(async(req, res)=>{
  const userId = req.user.id

  if(req.user.role !== 'doctor'){
    throw new ApiError(403, 'Only doctor can update this account')
  }

  const {name, specialization, qualification, experience, phone,consultationFee, licenseNo, address, hospitalId} = req.body

  const updated = await prisma.doctor.update({
    where:{
      userId
    },
    data:{
      userId,
      name,
      specialization,
      licenseNo,
      qualification,
      experience,
      hospitalId: hospitalId || null,
      fileUrl: cloudinaryResponse.url,
      phone,
      consultationFee,
      address: address || "",
    }
  })

  return res
  .status(200)
  .json(
    new ApiResponse(200, updated, 'doctor profile updated successfully')
  )
})

// doctor requests access to a patient's records
const requestAccess = asyncHandler(async(req, res)=>{
  if(req.user.role !== 'doctor'){
    throw new ApiError(403, 'Only doctor can request access')
  }

  const {patientId} = req.body
  if(!patientId){
    throw new ApiError(400, 'patientId is required')
  }

  const doctor = await prisma.doctor.findUnique({
    where:{
      userId: req.user.id
    }
  })

  if(!doctor){
    throw new ApiError(404, 'Doctor profile is not found')
  }

  const patient = await prisma.patient.findUnique({
    where:{
      id: patientId
    }
  })
  if(!patient){
     throw new ApiError(400, 'Selected patient does not exist')
  }

   const existing = await prisma.accessPermission.findFirst({
    where: { doctorId: doctor.id, patientId, status: { in: ["pending", "approved"] } }
  })
  if (existing) {
    throw new ApiError(409, `A ${existing.status} request already exists for this patient`)
  }
 
   await prisma.accessPermission.create({
    data: { doctorId: doctor.id, patientId, status: "pending" }
  })
 
  return res
    .status(201)
    .json(new ApiResponse(201, {}, "Access request sent successfully"))
})

// doctor views all requests they've sent, with current status
const getSentAccessRequests = asyncHandler(async (req, res) => {
  if (req.user.role !== "doctor") {
    throw new ApiError(403, "Only doctor accounts can view their sent requests")
  }
 
  const doctor = await prisma.doctor.findUnique({ where: { userId: req.user.id } })
  if (!doctor) throw new ApiError(404, "Doctor profile not found")
 
  const requests = await prisma.accessPermission.findMany({
    where: { doctorId: doctor.id },
    include: { patient: { select: { name: true, bloodGroup: true } } },
    orderBy: { createdAt: "desc" }
  })
 
  return res
    .status(200)
    .json(new ApiResponse(200, requests, "Sent access requests fetched successfully"))
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
      recordType,
      fileUrl: cloudinaryResponse.url
    }
  })
 
  return res
    .status(201)
    .json(new ApiResponse(201, record, "Medical record uploaded successfully"))
})
 
// doctor views a patient's records — only if they have approved access
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
 
const addPrescription = asyncHandler(async (req, res) => {
  if (req.user.role !== "doctor") {
    throw new ApiError(403, "Only doctor accounts can add prescriptions")
  }
 
  const { patientId, medicines, notes } = req.body
  if (!patientId || !medicines) {
    throw new ApiError(400, "patientId and medicines are required")
  }
 
  const doctor = await prisma.doctor.findUnique({ where: { userId: req.user.id } })
  if (!doctor) throw new ApiError(404, "Doctor profile not found")
 
  const allowed = await hasAccess(doctor.id, patientId)
  if (!allowed) {
    throw new ApiError(403, "Access denied. Request permission from the patient first.")
  }
 
  const prescription = await prisma.prescription.create({
    data: { patientId, doctorId: doctor.id, medicines, notes }
  })
 
  return res
    .status(201)
    .json(new ApiResponse(201, prescription, "Prescription added successfully"))
})
 
// doctor views all prescriptions they have issued
const getIssuedPrescriptions = asyncHandler(async (req, res) => {
  if (req.user.role !== "doctor") {
    throw new ApiError(403, "Only doctor accounts can view issued prescriptions")
  }
 
  const doctor = await prisma.doctor.findUnique({ where: { userId: req.user.id } })
  if (!doctor) throw new ApiError(404, "Doctor profile not found")
 
  const prescriptions = await prisma.prescription.findMany({
    where: { doctorId: doctor.id },
    include: { patient: { select: { name: true } } },
    orderBy: { issuedDate: "desc" }
  })
 
  return res
    .status(200)
    .json(new ApiResponse(200, prescriptions, "Issued prescriptions fetched successfully"))
})
 
const deletePrescription = asyncHandler(async(req, res) =>{
  if (req.user.role !== "doctor") {
    throw new ApiError(403, "Only doctor accounts can delete their appointments")
  }

  const doctor = await prisma.doctor.findUnique({ where: { userId: req.user.id } })

  if (!doctor) throw new ApiError(404, "Doctor profile not found")

  await prisma.prescription.delete(
    {
      where:{ id: req.params.id}
    })

   return res.status(200).json(new ApiResponse(200, {}, "Prescription deleted successfully"))
})

const getMyAppointments = asyncHandler(async (req, res) => {
  if (req.user.role !== "doctor") {
    throw new ApiError(403, "Only doctor accounts can view their appointments")
  }
 
  const doctor = await prisma.doctor.findUnique({ where: { userId: req.user.id } })
  if (!doctor) throw new ApiError(404, "Doctor profile not found")
 
  const appointments = await prisma.appointment.findMany({
    where: { doctorId: doctor.id },
    include: { patient: { select: { name: true, contact: true } } },
    orderBy: { scheduledAt: "asc" }
  })
 
  return res
    .status(200)
    .json(new ApiResponse(200, appointments, "Appointments fetched successfully"))
})
 
const deleteMyAppointments = asyncHandler(async(req, res)=>{
  if (req.user.role !== "doctor") {
    throw new ApiError(403, "Only doctor accounts can delete their appointments")
  }

  const doctor = await prisma.doctor.findUnique({ where: { userId: req.user.id } })

  if (!doctor) throw new ApiError(404, "Doctor profile not found")

  await prisma.appointment.delete(
    {
      where:{ id: req.params.id}
    }
  )

  return res.status(200).json(new ApiResponse(200, {}, "Appointment deleted successfully"))
})

// doctor updates appointment status after the visit
const updateAppointmentStatus = asyncHandler(async (req, res) => {
  if (req.user.role !== "doctor") {
    throw new ApiError(403, "Only doctor accounts can update appointment status")
  }
 
  const { status } = req.body // "completed" | "cancelled"
  if (!["completed", "cancelled"].includes(status)) {
    throw new ApiError(400, "status must be 'completed' or 'cancelled'")
  }
 
  const doctor = await prisma.doctor.findUnique({ where: { userId: req.user.id } })
  const appointment = await prisma.appointment.findUnique({ where: { id: req.params.id } })
 
  if (!appointment || appointment.doctorId !== doctor.id) {
    throw new ApiError(404, "Appointment not found")
  }
 
  const updated = await prisma.appointment.update({
    where: { id: req.params.id },
    data: { status }
  })
 
  return res
    .status(200)
    .json(new ApiResponse(200, updated, "Appointment status updated"))
}) 


export {
  getMyAppointments,
  updateAppointmentStatus,
  addPrescription,
  getIssuedPrescriptions,
  registerDoctor,
  getDoctorProfile,
  updateDoctorAccount,
  requestAccess,
  getSentAccessRequests,
  deleteMyAppointments,
  deletePrescription,
  uploadRecordForPatient,
  viewPatientRecords
}
 