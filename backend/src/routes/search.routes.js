import { Router } from "express"
import { getAllDoctors } from "../controllers/search.controller.js"

const router = Router()

router.route("/doctors").get(getAllDoctors)

export default router
