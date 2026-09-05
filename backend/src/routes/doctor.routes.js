import { Router } from "express"
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { addPrescription, deleteMyAppointments, deletePrescription, getDoctorProfile, getIssuedPrescriptions, getMyAppointments, getSentAccessRequests, registerDoctor, requestAccess, updateAppointmentStatus, updateDoctorAccount, uploadRecordForPatient, viewPatientRecords } from "../controllers/doctor.controller.js"
import { getDoctorDashboard } from "../controllers/dashboard.controller.js"

const router = Router()
router.use(verifyJWT) 
 
// ---- Profile ----
router.post("/profile", upload.single("file"), registerDoctor)
router.route("/profile").get(getDoctorProfile)

router.patch("/update-profile", upload.single("file"), updateDoctorAccount)
 
// ---- Access permission ----
router.post("/access-request", requestAccess)
router.get("/access-request/sent", getSentAccessRequests)
 
// ---- Medical records ----
router.post("/medical-records", upload.single("file"), uploadRecordForPatient)
router.get("/medical-records/patient/:patientId", viewPatientRecords)
 
// ---- Prescriptions ----
router.post("/prescriptions", addPrescription)
router.delete("/prescriptions/:id", deletePrescription)

router.get("/get-prescriptions", getIssuedPrescriptions)
 
// ---- Appointments ----
router.get("/appointments", getMyAppointments)
router.delete("/appointments/:id", deleteMyAppointments)
router.patch("/appointments/:id/status", updateAppointmentStatus)
 
// ---- Dashboard ----
router.get("/dashboard", getDoctorDashboard)
 
export default router
 
