import { BrowserRouter , Route, Routes, useParams} from "react-router-dom"
import  Home  from "./components/Home"
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from "./components/Navbar"
import About from "./pages/About"
import Register from "./auth/Register"
import Login from "./auth/login"
import PatientForm from "./auth/PatientForm"
import DoctorForm from "./auth/DoctorForm"
import HospitalForm from "./auth/HospitlaForm"
import PatientDashboard from "./dashboard/PatientDashboard"
import DoctorDashboard from "./dashboard/DoctorDashboard"
import HospitalDashboard from "./dashboard/HospitalDashboard"
import MyAppointments from "./Appointments/MyAppointment"
import MedicalHistory from "./records/MedicalHistory"
import MyPrescriptions from "./prescriptions/MyPrescriptions"
import AccessRequests from "./requests/AccessRequests"
import ViewRecords from "./records/ViewRecords"
import SentAccessRequests from "./requests/SentAccessRequests"
import DoctorPrescription from "./prescriptions/DoctorPrescription"
import DoctorAppointment from "./Appointments/DoctorAppointment"
import { Toaster } from "react-hot-toast"
import VerifyEmail from "./auth/Verify-Email"
import ResetPassword from "./auth/ResetPassword"
import ForgotPassword from "./auth/ForgotPassword"
import RoleSelection from "./auth/RoleSelection"
import ChangePassword from "./auth/ChangePassword"
import { useState } from "react"

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const path = window.location.pathname   
  const token = path.split("/")[2]
  return (
  <BrowserRouter >
  <Toaster position="top-center" /> 
    <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
    <main className="pt-16 min-h-screen bg-slate-50/80">
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/set-role" element={<RoleSelection />}/>
        <Route path="/about" element={<About />}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/verify-email" element={<VerifyEmail />}/>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/patient/profile" element={
          <ProtectedRoute allowedRole="patient">
          <PatientForm />
          </ProtectedRoute>} />
        <Route path="/doctor/profile" element={
          <ProtectedRoute allowedRole="doctor">
          <DoctorForm sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>
          </ProtectedRoute>} />
        <Route path="/hospital/profile" element={
          <ProtectedRoute allowedRole="hospital">
          <HospitalForm />
          </ProtectedRoute>} />
        <Route path="/patient/dashboard" 
        element={
         <ProtectedRoute allowedRole="patient">
          <PatientDashboard sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
         </ProtectedRoute>} />
        <Route path="/doctor/dashboard" 
         element={
         <ProtectedRoute allowedRole="doctor"> 
          <DoctorDashboard sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>
         </ProtectedRoute>} />
        <Route path="/doctor/records/:patientId" 
         element={
         <ProtectedRoute allowedRole="doctor"> 
          <ViewRecords />
         </ProtectedRoute>} />
          <Route path="/doctor/access-request/sent" 
         element={
         <ProtectedRoute allowedRole="doctor"> 
          <SentAccessRequests />
         </ProtectedRoute>} />
         <Route path="/doctor/prescriptions" 
         element={
         <ProtectedRoute allowedRole="doctor"> 
          <DoctorPrescription />
         </ProtectedRoute>} />
          <Route path="/doctor/appointments" 
         element={
         <ProtectedRoute allowedRole="doctor"> 
          <DoctorAppointment />
         </ProtectedRoute>} />
        <Route path="/hospital/dashboard" 
         element={
         <ProtectedRoute allowedRole="hospital"> 
          <HospitalDashboard sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>
         </ProtectedRoute>} />
         <Route path="/patient/my-appointments" 
         element={
         <ProtectedRoute allowedRole="patient"> 
          <MyAppointments />
         </ProtectedRoute>} />
         <Route path="/patient/records" 
         element={
         <ProtectedRoute allowedRole="patient"> 
          <MedicalHistory />
         </ProtectedRoute>} />
         <Route path="/patient/prescriptions" 
         element={
         <ProtectedRoute allowedRole="patient"> 
          <MyPrescriptions />
         </ProtectedRoute>} />

         <Route path="/patient/change-password" 
         element={
         <ProtectedRoute allowedRole="patient"> 
          <ChangePassword sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>
         </ProtectedRoute>} />
         <Route path="/doctor/change-password" 
         element={
         <ProtectedRoute allowedRole="doctor"> 
          <ChangePassword />
         </ProtectedRoute>} />
         
         <Route path="/patient/access-requests" 
         element={
         <ProtectedRoute allowedRole="patient"> 
          <AccessRequests />
         </ProtectedRoute>} />
      </Routes>
    </main>
  </BrowserRouter>
  )
}

export default App
