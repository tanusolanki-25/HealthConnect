import { Router } from "express"
import { getAllDoctors, searchHospitals } from "../controllers/search.controller.js"

const router = Router()

router.route("/doctors").get(getAllDoctors)
router.route("/hospitals").get(searchHospitals)

export default router
