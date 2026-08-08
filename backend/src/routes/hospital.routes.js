import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { getAffiliatedDoctors, getHospitalAppointments, getHospitalRecords, getMyProfile, registerHospital, removeDoctorAffiliation, updateHospitalAccount } from "../controllers/hospital.controller.js"
import { getHospitalDashboard } from "../controllers/dashboard.controller.js"

const router = Router()

router.use(verifyJWT)

// ---- Profile ----
router.post("/profile", registerHospital)
router.patch("/profile", updateHospitalAccount)
router.get("/profile/me", getMyProfile)

// ---- Doctors ----
router.get("/doctors", getAffiliatedDoctors)
router.delete("/doctors/:doctorId", removeDoctorAffiliation)

// ---- Appointments ----
router.get("/appointments", getHospitalAppointments)

// ---- Medical records ----
router.get("/medical-records", getHospitalRecords)

// ---- Dashboard ----
router.get("/dashboard", getHospitalDashboard)

export default router