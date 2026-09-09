import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { 
  getAffiliatedDoctors, 
  getDoctorDetails, 
  getHospitalAppointments, 
  updateHospitalAppointmentStatus,
  getMyProfile, 
  registerHospital, 
  removeDoctorAffiliation, 
  updateHospitalAccount, 
} from "../controllers/hospital.controller.js"
import { getHospitalDashboard } from "../controllers/dashboard.controller.js"
import { upload } from "../middlewares/multer.middleware.js"


const router = Router()

router.use(verifyJWT)
 
const hospitalUpload = upload.fields([
  { name: "logo", maxCount: 1 },
  { name: "certificate", maxCount: 1 }
])
 
// ---- Profile ----
router.post("/profile", hospitalUpload, registerHospital)
router.patch("/update-profile", hospitalUpload, updateHospitalAccount)
router.get("/profile", getMyProfile)

// ---- Doctors ----
router.get("/doctors", getAffiliatedDoctors)
router.get("/doctors/:doctorId", getDoctorDetails)
router.delete("/doctors/:doctorId", removeDoctorAffiliation)

// ---- Appointments ----
router.get("/appointments", getHospitalAppointments)
router.patch("/appointments/:id/status", updateHospitalAppointmentStatus)

// ---- Dashboard ----
router.get("/dashboard", getHospitalDashboard)

export default router