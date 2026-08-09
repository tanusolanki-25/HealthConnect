# HealthConnect — One Patient. One Health Record.

A unified healthcare record management platform that connects patients, doctors, and hospitals — with patient-controlled, permission-based access to medical data.

## 🩺 Problem

Patient health records today are scattered across multiple hospitals, clinics, and diagnostic centers. Doctors lack complete patient history, tests get repeated unnecessarily, and emergency treatment gets delayed due to unavailable records. HealthConnect brings all of this into one place — with the patient, not the hospital, at the center.

## ✨ Features

### Patient
- Create and manage a digital health profile
- Upload and view medical records / reports
- Approve or deny doctor access requests to their records
- Book appointments with doctors
- View prescriptions issued by doctors

### Doctor
- Request access to a patient's records (permission-based)
- View patient records once access is approved
- Issue prescriptions
- Manage appointments

### Hospital
- Manage a profile and affiliated doctors
- View appointments and records linked to the hospital

## 🔒 Core Design Principle

Records stay **patient-centric**, not hospital-wise. No doctor or hospital can view a patient's data without that patient explicitly approving an access request — including a live status (pending/approved/denied) and automatic expiry.

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), Tailwind CSS, React Router, Axios |
| Backend | Node.js, Express.js |
| Database | PostgreSQL (via Prisma ORM) |
| Authentication | JWT (access + refresh tokens), httpOnly cookies |
| File Storage | Cloudinary |
| Deployment | Vercel (frontend), Render (backend), Neon (database) |

## 🚀 Live Demo

- App: [`<add your Vercel URL here>`](https://health-connect-git-main-tanu-solankis-projects.vercel.app/)

> Note: the backend is on a free tier and may take 30–60 seconds to respond on the first request after inactivity.

## 📂 Project Structure

```
healthconnect-backend/
├── controllers/       → business logic per feature (auth, profile, appointments, etc.)
├── routes/             → API route definitions per role (patient, doctor, hospital)
├── middleware/         → auth (JWT) and file upload (multer) middleware
├── prisma/schema.prisma → database schema
├── utils/               → shared helpers (ApiError, ApiResponse, asyncHandler, cloudinary)
└── index.js             → app entry point

healthconnect-frontend/
├── src/pages/           → route-level pages (Login, Signup, Dashboards, etc.)
├── src/components/      → reusable UI (Navbar, ProtectedRoute)
├── src/context/         → AuthContext (login state across the app)
└── src/api/axios.js     → configured API client
```

## ⚙️ Local Setup

### Backend
```bash
cd healthconnect-backend
npm install
cp .env.example .env   # fill in your DATABASE_URL, JWT secrets, Cloudinary keys
npx prisma migrate dev --name init
npm run dev

### Frontend
```bash
cd healthconnect-frontend
npm install
npm run dev
```

## 🔑 Environment Variables

**Backend**
```
DATABASE_URL=
PORT=5000
FRONTEND_URL=
ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

**Frontend**
```
VITE_API_URL=
```

## 📡 API Overview

| Base path | Covers |
|---|---|
| `/api/auth` | Signup, login, logout, token refresh |
| `/api/patient` | Profile, records, appointments, prescriptions, access requests |
| `/api/doctor` | Profile, access requests, records, prescriptions, appointments |


## 🗺️ Roadmap

- [x] Authentication & role-based access
- [x] Patient / doctor / hospital profiles
- [x] Permission-based record access
- [x] Appointments & prescriptions

