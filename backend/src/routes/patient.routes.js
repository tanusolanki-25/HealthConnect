import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.middleware.js"
import { approveAccessRequest, bookAppointment, deleteMedicalRecord, deleteMyAppointments, deleteMyPrescriptions, denyAccessRequest, getMyAccessRequests, getMyAppointments, getMyMedicalHistory, getMyPrescriptions, getPatientProfile, registerPatient, updatePatientAccount, uploadOwnMedicalRecord } from "../controllers/patient.controller.js"
import { getPatientDashboard } from "../controllers/dashboard.controller.js"

const router = Router()

router.use(verifyJWT)

router.route("/profile").post(registerPatient)
router.route("/profile").get(getPatientProfile)

router.route("/update-profile").patch(updatePatientAccount)

// ---- Medical records ----
router.route("/upload-records").post(upload.single("file"), uploadOwnMedicalRecord)
router.route("/records/my-history").get( getMyMedicalHistory)
router.delete("/medical-records/:id", deleteMedicalRecord)

// ---- Access permission ----
router.route("/access-requests").get(getMyAccessRequests)
router.route("/access-requests/:id/approve").patch(approveAccessRequest)
router.route("/access-requests/:id/deny").patch(denyAccessRequest)

// ---- Appointments ----
router.route("/appointments").post( bookAppointment)
router.route("/my-appointments").get(getMyAppointments)
router.delete("/appointments/:id", deleteMyAppointments)


// ---- Prescriptions ----
router.route("/prescriptions").get( getMyPrescriptions)
router.delete("/prescriptions/:id", deleteMyPrescriptions)

router.route("/dashboard").get( getPatientDashboard)

export default router
