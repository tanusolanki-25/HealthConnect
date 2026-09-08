import { Router } from "express"
import { getAllDoctors, getAllHospitals, searchHospitals } from "../controllers/search.controller.js"

const router = Router()

router.route("/doctors").get(getAllDoctors)
router.route("/hospitals").get(getAllHospitals)
// router.route("/hospitals/name").get(searchHospitals)

export default router
