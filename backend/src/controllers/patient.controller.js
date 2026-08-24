import prisma from "../lib/prisma.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const registerPatient = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { name, dob, gender, bloodGroup, phone, address, city, state, pincode, emergencyContactName, emergencyContactPhone, emergencyRelationship, height, weight, allergies, existingDiseases} = req.body;

  if (!name || !dob || !gender || !phone) {
    throw new ApiError(400, "Name, date of birth, phone and gender are required");
  }

  if (req.user.role !== "patient") {
    throw new ApiError(
      403,
      "Only patient accounts can create a patient profile"
    );
  }

  const existingProfile = await prisma.patient.findUnique({
    where: { userId },
  });

  if (existingProfile) {
    throw new ApiError(409, "Patient profile already exists for this user");
  }

  const patient = await prisma.patient.create({
    data: {
      userId,
      name,
      dob: new Date(dob),
      gender,
      bloodGroup,
      phone,
      address, 
      city, 
      state, 
      pincode, 
      emergencyContactName, 
      emergencyContactPhone, 
      relationship: emergencyRelationship, 
      height: height ? Number(height) : null,
      weight: weight ? Number(weight) : null, 
      allergies, 
      existingDiseases
    },
  });

  return res
    .status(201)
    .json(
      new ApiResponse(201, patient, "Patient profile created successfully")
    );
});

const getPatientProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const existingProfile = await prisma.patient.findUnique({
    where: { userId },
  });

  if (!existingProfile) {
    throw new ApiError(404, "Patient profile does not exist for this user");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, existingProfile, "Patient profile fetched successfully")
    );
});


const updatePatientAccount = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  if (req.user.role !== "patient") {
    throw new ApiError(
      403,
      "Only patient accounts can update a patient profile"
    );
  }

  const {
    name,
    dob,
    gender,
    bloodGroup,
    phone,
    address,
    city,
    state,
    pincode,
    emergencyContactName,
    emergencyContactPhone,
    emergencyRelationship,
    height,
    weight,
    allergies,
    existingDiseases,
  } = req.body;

  const existingProfile = await prisma.patient.findUnique({
    where: { userId },
  });

  if (!existingProfile) {
    throw new ApiError(404, "Patient profile does not exist");
  }

  const updated = await prisma.patient.update({
    where: { userId },
    data: {
      ...(name && { name }),
      ...(dob && { dob: new Date(dob) }),
      ...(gender && { gender }),
      ...(bloodGroup !== undefined && { bloodGroup }),
      ...(phone && { phone }),
      ...(address !== undefined && { address }),
      ...(city !== undefined && { city }),
      ...(state !== undefined && { state }),
      ...(pincode !== undefined && { pincode }),
      ...(emergencyContactName !== undefined && { emergencyContactName }),
      ...(emergencyContactPhone !== undefined && { emergencyContactPhone }),
      ...(emergencyRelationship !== undefined && { relationship: emergencyRelationship }),
      ...(height !== undefined && { height: height ? Number(height) : null }),
      ...(weight !== undefined && { weight: weight ? Number(weight) : null }),
      ...(allergies !== undefined && { allergies }),
      ...(existingDiseases !== undefined && { existingDiseases }),
    },
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, updated, "Patient profile updated successfully")
    );
});

const uploadOwnMedicalRecord = asyncHandler(async(req, res)=>{
   if(req.user.role !== 'patient'){
    throw new ApiError(403, 'Only patients can upload records on this endpoint')
   }

   const {recordType} = req.body
   const localFilePath = req.file?.path

   if(!recordType){
    throw new ApiError(400, 'Recordtype is required')
   }

   if(!localFilePath){
    throw new ApiError(400, 'File is required')
   }

   const patient = await prisma.patient.findUnique({
    where:{
      userId: req.user.id
    }
   })

  if(!patient){
    throw new ApiError(404, 'Patient profile is not found')
  }

  const cloudinaryResponse = await uploadOnCloudinary(localFilePath)

  if(!cloudinaryResponse){
    throw new ApiError(500, 'File upload failed, please try again')
  }

  const record = await prisma.medicalRecord.create({
    data:{
      patientId: patient.id,
      recordType,
      fileUrl: cloudinaryResponse.url
    }
  })

  return res
  .status(201)
  .json(
    new ApiResponse(201, record, "Medical record uploaded successfully")
  )
})

const getMyMedicalHistory = asyncHandler(async(req, res) =>{
   if(req.user.role !== 'patient'){
    throw new ApiError(403, 'Only patient accounts can view their own medical history')
   }

   const patient = await prisma.patient.findUnique({
    where:{
      userId: req.user.id
    }
   })

   if(!patient){
    throw new ApiError(404, 'Patient profile not found')
   }

   const records = await prisma.medicalRecord.findMany({
    where:{
      patientId: patient.id
    },
    include:{
      doctor: {
       select: {name: true,
        specialization: true}
      },
      hospital:{
        select:{
          name: true
        }
      }
    },
    orderBy :{
      uploadDate: 'desc'
    }
   })

   return res
   .status(200)
   .json(
    new ApiResponse(200, records, 'Medical history fetched successfully')
   )
})

const deleteMedicalRecord = asyncHandler(async(req, res) =>{
    if (req.user.role !== "patient") {
    throw new ApiError(403, "Only patient accounts can delete their own records")
  }

  const patient = await prisma.patient.findUnique({ where: { userId: req.user.id } })
  if (!patient) throw new ApiError(404, "Patient profile not found")

  const record = await prisma.medicalRecord.findUnique({ where: { id: req.params.id } })

  // ownership check — sirf apna record delete kar sake, kisi aur ka nahi
  if (!record || record.patientId !== patient.id) {
    throw new ApiError(404, "Record not found")
  }

  await prisma.medicalRecord.delete({ where: { id: req.params.id } })

  return res.status(200).json(new ApiResponse(200, {}, "Record deleted successfully"))
})

const getMyPrescriptions = asyncHandler(async(req, res)=>{
   if(req.user.role !== 'patient'){
    throw new ApiError(403, 'Only patient accounts can view their prescriptions')
   }

   const patient = await prisma.patient.findUnique({
    where:{
      userId: req.user.id
    }
   })

   if(!patient){
    throw new ApiError(404, 'Patient profile not found')
   }

   const prescriptions = await prisma.prescription.findMany({
      where:{
        patientId: patient.id
      },
      include:{
        doctor:{
          select:{
            name: true,
            specialization: true
          }
        }
      },
      orderBy:{
        issuedDate: 'desc'
      }
   })

   return res
   .status(200)
   .json(
    new ApiResponse(200, prescriptions, 'Prescriptions fetched successfully')
   )
})

const deleteMyPrescriptions = asyncHandler(async(req, res)=>{
    if (req.user.role !== "patient") {
     throw new ApiError(403, "Only patient accounts can delete their own prescriptions")
  }

  const patient = await prisma.patient.findUnique({ where: { userId: req.user.id } })
  if (!patient) throw new ApiError(404, "Patient profile not found")

  const prescriptions = await prisma.prescription.findUnique({ where: { id: req.params.id } })

  if (!prescriptions || prescriptions.patientId !== patient.id) {
    throw new ApiError(404, "Record not found")
  }

  await prisma.prescription.delete({ where: { id: req.params.id } })

  return res.status(200).json(new ApiResponse(200, {}, "Prescriptions deleted successfully"))
})


const bookAppointment = asyncHandler(async (req, res) => {
  if (req.user.role !== "patient") {
    throw new ApiError(403, "Only patient accounts can book appointments")
  }

  const { doctorId, scheduledAt } = req.body

  if (!doctorId || !scheduledAt) {
    throw new ApiError(400, "doctorId and scheduledAt are required")
  }

  const patient = await prisma.patient.findUnique({ where: { userId: req.user.id } })
  if (!patient) throw new ApiError(404, "Patient profile not found")

  const doctor = await prisma.doctor.findUnique({ where: { id: doctorId } })
  if (!doctor) throw new ApiError(400, "Selected doctor does not exist")

  const appointment = await prisma.appointment.create({
    data: {
      patientId: patient.id,
      doctorId,
      hospitalId: doctor.hospitalId || null,
      scheduledAt: new Date(scheduledAt)
    }
  })

  return res
    .status(201)
    .json(new ApiResponse(201, appointment, "Appointment booked successfully"))
})

const getMyAppointments = asyncHandler(async (req, res) => {
  if (req.user.role !== "patient") {
    throw new ApiError(403, "Only patient accounts can view their appointments")
  }

  const patient = await prisma.patient.findUnique({ where: { userId: req.user.id } })
  if (!patient) throw new ApiError(404, "Patient profile not found")

  const appointments = await prisma.appointment.findMany({
    where: { patientId: patient.id },
    include: { doctor: { select: { name: true, specialization: true } } },
    orderBy: { scheduledAt: "asc" }
  })

  return res
    .status(200)
    .json(new ApiResponse(200, appointments, "Appointments fetched successfully"))
})

const deleteMyAppointments = asyncHandler(async(req, res) =>{
   if(req.user.role !== 'patient'){
    throw new ApiError(403, "Only patient accounts can delete their own appointments")
   }

   const patient = await prisma.patient.findUnique({ where: { userId: req.user.id } })
  if (!patient) throw new ApiError(404, "Patient profile not found")

  const appointments = await prisma.appointment.findUnique({ where: { id: req.params.id } })

  if (!appointments || appointments.patientId !== patient.id) {
    throw new ApiError(404, "Appointments not found")
  }

  await prisma.appointment.delete({ where: { id: req.params.id } })

  return res.status(200).json(new ApiResponse(200, {}, "Appointments deleted successfully"))

})

// patient views all access requests made to them (pending, approved, denied)
const getMyAccessRequests = asyncHandler(async (req, res) => {
  if (req.user.role !== "patient") {
    throw new ApiError(403, "Only patient accounts can view their access requests")
  }

  const patient = await prisma.patient.findUnique({ where: { userId: req.user.id } })
  if (!patient) throw new ApiError(404, "Patient profile not found")

  const requests = await prisma.accessPermission.findMany({
    where: { patientId: patient.id },
    include: { doctor: { select: { name: true, specialization: true } } },
    orderBy: { createdAt: "desc" }
  })

  return res
    .status(200)
    .json(new ApiResponse(200, requests, "Access requests fetched successfully"))
})

// patient approves a pending request — grants 30-day access
const approveAccessRequest = asyncHandler(async (req, res) => {
  if (req.user.role !== "patient") {
    throw new ApiError(403, "Only patient accounts can approve access requests")
  }

  const patient = await prisma.patient.findUnique({ where: { userId: req.user.id } })
  const request = await prisma.accessPermission.findUnique({ where: { id: req.params.id } })

  if (!request || request.patientId !== patient.id) {
    throw new ApiError(404, "Access request not found")
  }

  const expiryDate = new Date()
  expiryDate.setDate(expiryDate.getDate() + 30)

    await prisma.accessPermission.update({
    where: { id: req.params.id },
    data: { status: "approved", expiryDate }
  })

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Access request approved"))
})

// patient denies a pending request
const denyAccessRequest = asyncHandler(async (req, res) => {
  if (req.user.role !== "patient") {
    throw new ApiError(403, "Only patient accounts can deny access requests")
  }

  const patient = await prisma.patient.findUnique({ where: { userId: req.user.id } })
  const request = await prisma.accessPermission.findUnique({ where: { id: req.params.id } })

  if (!request || request.patientId !== patient.id) {
    throw new ApiError(404, "Access request not found")
  }

    await prisma.accessPermission.update({
    where: { id: req.params.id },
    data: { status: "denied", expiryDate: null }
  })

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Access request denied"))
})

export {
  registerPatient,
  getPatientProfile,
  updatePatientAccount,
  uploadOwnMedicalRecord,
  getMyMedicalHistory,
  getMyPrescriptions,
  bookAppointment,
  getMyAppointments,
  getMyAccessRequests,
  approveAccessRequest,
  denyAccessRequest,
  deleteMedicalRecord,
  deleteMyAppointments,
  deleteMyPrescriptions
}