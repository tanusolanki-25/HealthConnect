import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

const rawOrigins = (process.env.CORS_ORIGIN || '').split(',').map(o => o.trim().replace(/\/$/, '')).filter(Boolean);
const defaultOrigins = [
  'https://health-connect-git-main-tanu-solankis-projects.vercel.app',
  'https://health-connect-zeta-seven.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000'
];

const allowedOrigins = Array.from(new Set([...rawOrigins, ...defaultOrigins]));

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    const cleanOrigin = origin.replace(/\/$/, '');
    if (allowedOrigins.includes(cleanOrigin) || cleanOrigin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    return callback(new Error(`CORS policy blocked request from ${origin}`));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
}))

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