import { Router } from "express"
import { getAllDoctors, getAllHospitals, searchHospitals } from "../controllers/search.controller.js"

const router = Router()

router.route("/doctors").get(getAllDoctors)
router.route("/hospitals").get(getAllHospitals)

export default router
