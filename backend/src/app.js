import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
  origin:[process.env.CORS_ORIGIN, 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],
  credentials: true,
}))
app.options('*', cors());

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


//routes import
import authRouter from "../src/routes/auth.routes.js"
import patientRouter from "../src/routes/patient.routes.js"
import doctorRouter from "../src/routes/doctor.routes.js"
import hospitalRouter from "../src/routes/hospital.routes.js"
import searchRoutes from '../src/routes/search.routes.js'

//routes declaration
app.use("/api/auth", authRouter)
app.use("/api/patient", patientRouter)
app.use("/api/doctor", doctorRouter)
app.use("/api/hospital", hospitalRouter)
app.use("/api/search", searchRoutes)

// global error handling middleware
import { errorHandler } from "../src/middlewares/error.middleware.js"
app.use(errorHandler)

export { app }