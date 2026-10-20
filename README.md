<div align="center">

# 🏥 CareWell Hospital Management System

<i>Your Health, Our Priority.</i>

**A modern, full-stack digital health ecosystem for hospital administration, doctor scheduling, and patient appointment management.**

<p align="center">
  <img src="https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React 19" />
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge" alt="Express.js" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB Atlas" />
  <img src="https://img.shields.io/badge/Tailwind_CSS_4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS 4" />
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/LICENSE-MIT-ffb6c1?style=for-the-badge" alt="License MIT" />
  <img src="https://img.shields.io/badge/Deployed-Vercel-00C7B7?style=for-the-badge&logo=vercel" alt="Deployed on Vercel" />
</p>

### 🔗 Live Demo
| | URL |
|---|---|
| **Frontend** | https://hospital-appointment-system-ten-plum.vercel.app |
| **Backend API** | https://hospital-appointment-system-backend.vercel.app |

</div>

---

# Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Architecture](#project-architecture)
- [Folder Structure](#folder-structure)
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Local Development](#local-development)
- [Available Scripts](#available-scripts)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Authentication](#authentication)
- [Application Workflow](#application-workflow)
- [Design Patterns](#design-patterns)
- [Security](#security)
- [Error Handling](#error-handling)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Recent Updates](#recent-updates)
- [License](#license)
- [Author](#author)

---

# Overview
The **CareWell Hospital Management System** is a production-ready full-stack web application designed to streamline operations for medical facilities. It automates doctor management, user authentication, and patient appointment scheduling.

- **Problem Solved:** Reduces administrative bottlenecks, eliminates scheduling conflicts, and provides elegant dashboards for both patients and hospital administrators.
- **Target Users:** Patients seeking medical appointments, and Hospital Administrators managing departments, rosters, and operational metrics.
- **Key Objectives:** Enable seamless online booking, provide reactive dashboards, ensure robust security for medical data, and maintain a modular backend.

---

# Features
- **Role-Based Authentication (RBAC):** Secure signup and login for patients and administrators with JWT-based verification, password hashing with `bcryptjs`, and strict route middleware (`requireAuth`, `requireRole`).
- **Dual-Token Transmission:** Seamless support for both HTTP-only cookies and `Authorization: Bearer <token>` headers via a unified frontend API client (`apiFetch`), guaranteeing cross-domain reliability.
- **Double-Booking Concurrency Protection:** Eliminates slot collision through controller-level validation and a MongoDB compound partial unique index on `{ doctorId, appointmentDate, appointmentTime }` for active bookings.
- **Soft Deletion & Audit Compliance:** Doctors and appointments are soft-deleted (`isDeleted: true`) by default to protect medical records, with optional hard-deletion (`?hardDelete=true`) for admins.
- **Search, Filtering & Pagination:** High-performance queries with text search indexing across doctor names, specialties, and hospitals, plus flexible pagination metadata (`total`, `totalPages`, `currentPage`).
- **Live Doctor Directory:** The public specialists directory connects directly to live backend inventory with instant search and category filtering.
- **Role-Based Sessions:** Separate, independent browser sessions for admin and patient roles (`adminUser` and `patientUser`), allowing concurrent logins without session conflicts.
- **Interactive Dashboards:** Specialized reactive dashboards for Patients (view history, book appointments, track status) and Admins (track statistics, manage doctors, view hospital metrics).
- **Dynamic Charts & Analytics:** Interactive data visualizations (Recharts) showing hospital occupancy, appointment status distribution, and operational metrics.
- **SPA Routing:** Client-side routing with `vercel.json` rewrite rules so page refreshes on any route work without 404 errors.

---

# Tech Stack

| Category | Technology |
| :--- | :--- |
| **Frontend Framework** | React 19, React Router DOM v7 |
| **Backend Framework** | Node.js, Express v4 |
| **Database** | MongoDB Atlas (cloud), Mongoose ODM v8 |
| **Authentication** | JWT (JSON Web Tokens), Bcryptjs, Cookie-Parser |
| **Build Tool** | Vite 8 |
| **Styling** | Tailwind CSS v4 (`@tailwindcss/vite`) |
| **Icons** | Lucide React |
| **Charts** | Recharts |
| **Deployment** | Vercel (both frontend and backend) |
| **Version Control** | Git + GitHub |

---

# Project Architecture

Both frontend and backend are deployed on **Vercel** as separate projects in the same GitHub repository.

```
+──────────────────────────────────────────────────────────────+
│                        CLIENT (Vercel)                       │
│            React 19 · Vite · Tailwind CSS v4                │
│        https://hospital-appointment-system-ten-plum.vercel.app│
+──────────────────────────┬───────────────────────────────────+
                           │  HTTP/JSON requests
                           │  VITE_API_URL env var
+──────────────────────────▼───────────────────────────────────+
│                       BACKEND (Vercel)                       │
│           Express 4 · Node.js · JWT · Bcryptjs              │
│     https://hospital-appointment-system-backend.vercel.app   │
│                                                              │
│   ┌─────────────┐  ┌──────────────────┐  ┌──────────────┐  │
│   │   Routes    │  │   Controllers    │  │  Middlewares │  │
│   └─────────────┘  └──────────────────┘  └──────────────┘  │
+──────────────────────────┬───────────────────────────────────+
                           │  Mongoose queries
+──────────────────────────▼───────────────────────────────────+
│                    DATABASE (MongoDB Atlas)                   │
│              Users · Doctors · Appointments                  │
+──────────────────────────────────────────────────────────────+
```

---

# Folder Structure

```
Hospital-appointment-system/
├── backend/                        # Express REST API — deployed to Vercel
│   ├── Controllers/
│   │   ├── authController.js       # Signup, Login, Logout, VerifyUser
│   │   ├── doctorController.js     # CRUD for doctor profiles
│   │   └── appointmentController.js# Book, list, update, cancel appointments
│   ├── Middlewares/
│   │   └── authMiddlewares.js      # JWT token verification middleware
│   ├── Models/
│   │   ├── UserModels.js           # User (patient/admin) schema
│   │   ├── doctorModels.js         # Doctor profile schema
│   │   └── appointment.js          # Appointment schema
│   ├── Routes/
│   │   ├── authRoutes.js
│   │   ├── doctorRoutes.js
│   │   └── appointmentRoutes.js
│   ├── utils/
│   │   └── SecretToken.js          # JWT creation helper
│   ├── vercel.json                 # Vercel serverless config for backend
│   ├── .env                        # Local environment variables (not committed)
│   ├── .env.example                # Template for environment variables
│   └── index.js                    # App entry point, DB connection, middleware
│
├── frontend/                       # React SPA — deployed to Vercel
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/             # Navbar, Footer
│   │   ├── data/                   # Static mock/seed data
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx  # Hospital admin panel
│   │   │   ├── Dashboard.jsx       # Patient dashboard
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   └── Doctors.jsx
│   │   ├── App.jsx                 # React Router setup
│   │   └── main.jsx
│   ├── vercel.json                 # SPA fallback rewrite rules
│   ├── vite.config.js
│   ├── .env.example                # Template for environment variables
│   └── package.json
│
├── .env.example                    # Overview of environment configuration
├── .gitignore
├── DEPLOYMENT.md                   # Step-by-step deployment guide
└── README.md
```

---

# Prerequisites
- **Node.js** `v18.x` or later (recommended: `v20.x` LTS)
- **npm** `v9.x` or later
- **MongoDB Atlas** account with a cluster and connection string (`mongodb+srv://...`)

> ⚠️ Local MongoDB (`localhost:27017`) will **not** work with the deployed backend on Vercel.

---

# Environment Variables

### Backend (`backend/.env`)

Copy `backend/.env.example` to `backend/.env` and fill in your values:

```ini
PORT=5001
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/Hospital-appointment-system?retryWrites=true&w=majority
TOKEN_KEY=your_strong_jwt_secret_minimum_32_characters
ACCESS_CODE=your_admin_signup_code
FRONTEND_URL=https://hospital-appointment-system-ten-plum.vercel.app
```

| Variable | Description |
|---|---|
| `PORT` | Local server port (default: `5001`) |
| `MONGO_URI` | MongoDB Atlas connection string — **must be `mongodb+srv://...`** |
| `TOKEN_KEY` | JWT signing secret — use a long random string |
| `ACCESS_CODE` | Secret code required to register an admin account |
| `FRONTEND_URL` | Production frontend URL (for CORS) |

### Frontend (`frontend/.env`)

```ini
VITE_API_URL=http://localhost:5001
```

For production, set this in **Vercel Dashboard → Frontend Project → Settings → Environment Variables**:
```ini
VITE_API_URL=https://hospital-appointment-system-backend.vercel.app
```

---

# Local Development

### 1. Clone the repository
```bash
git clone https://github.com/zaaraf027-glitch/Hospital-appointment-system.git
cd Hospital-appointment-system
```

### 2. Set up the Backend
```bash
cd backend
cp .env.example .env
# Edit .env and fill in MONGO_URI, TOKEN_KEY, ACCESS_CODE
npm install
npm run dev
# Backend runs on http://localhost:5001
```

### 3. Set up the Frontend
```bash
cd frontend
# Ensure frontend/.env has: VITE_API_URL=http://localhost:5001
npm install
npm run dev
# Frontend runs on http://localhost:5173
```

---

# Available Scripts

### Frontend (`frontend/`)
| Script | Description |
|---|---|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Build optimized production bundle to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint checks |

### Backend (`backend/`)
| Script | Description |
|---|---|
| `npm run dev` | Start with nodemon (auto-reload on save) |
| `npm start` | Start with plain Node (used by Vercel) |

---

# Usage

1. **Sign Up:** Create a patient account at `/signup`. To create an admin account, use the admin access code.
2. **Log In:** Go to `/login` — you are redirected to `/dashboard` (patient) or `/admin` (admin) based on your role.
3. **Patient Dashboard:** View your appointments, browse doctors, book a new appointment, manage your profile.
4. **Admin Dashboard:** View hospital statistics, manage doctor profiles (add/edit/delete), review all appointments, approve/cancel pending requests.
5. **Book Appointment:** Select a doctor → View Profile → choose a date and time slot → Confirm Appointment.

---

# API Documentation

Base URL (production): `https://hospital-appointment-system-backend.vercel.app`

### Authentication (`/`)
| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `POST` | `/signup` | Public | Register patient or admin (with `accessCode`) |
| `POST` | `/login` | Public | Authenticate user; returns JWT token & user profile |
| `POST` | `/logout` | Public | Clear authentication cookie |
| `GET` | `/verify` | Public (Token) | Verify token and return user identity |
| `GET` | `/health` | Public | Server uptime, database status, and endpoint inventory |

### Doctors (`/doctor`)
| Method | Endpoint | Auth Required | Query Params | Description |
|---|---|---|---|---|
| `GET` | `/doctor/all` | Public | `page`, `limit`, `search`, `specialization`, `isAvailable`, `sortBy`, `order` | Get doctors with search, filtering, and pagination |
| `GET` | `/doctor/:id` | Public | None | Get specific doctor details by ID |
| `POST` | `/doctor/add` | `admin` | None | Create a new doctor profile |
| `PUT` | `/doctor/update/:id` | `admin` | None | Update doctor details, fee, or availability |
| `DELETE` | `/doctor/delete/:id` | `admin` | `hardDelete` (`true`/`false`) | Soft delete (default) or permanently delete a doctor |

### Appointments (`/appointment`)
| Method | Endpoint | Auth Required | Query Params | Description |
|---|---|---|---|---|
| `POST` | `/appointment/book` | `patient` / `admin` | None | Book appointment (prevents double-booking collisions) |
| `GET` | `/appointment/my/:patientId` | Authenticated | `status`, `page`, `limit` | Get patient appointments (patients restricted to own records) |
| `GET` | `/appointment/all` | `admin` | `status`, `doctorId`, `patientId`, `date`, `page`, `limit`, `sortBy`, `order` | Get all hospital appointments with filters & pagination |
| `PUT` | `/appointment/update/:id` | Authenticated | None | Update status (patients can only Cancel; admins have full access) |
| `DELETE` | `/appointment/delete/:id` | `admin` | `hardDelete` (`true`/`false`) | Archive (soft delete) or permanently delete an appointment |

---

# Database Schema

### User (`UserModels.js`)
| Field | Type | Attributes | Description |
|---|---|---|---|
| `username` | String | Required, Trimmed | Full name or handle |
| `email` | String | Required, Unique, Lowercase | User account email |
| `password` | String | Required, Min 6 chars | Bcrypt hashed with salt rounds |
| `role` | String | Enum: `["patient", "admin"]` | Access tier (default: `"patient"`) |
| `phone` | String | Optional | Contact phone number |
| `gender` | String | Enum: `["Male", "Female", "Other"]` | Patient gender |
| `address` | String | Optional | Residential address |
| `timestamps` | Date | Auto-generated | `createdAt`, `updatedAt` |

### Doctor (`doctorModels.js`)
| Field | Type | Attributes | Description |
|---|---|---|---|
| `name` | String | Required, Trimmed | Doctor's full name |
| `specialization` | String | Required, Indexed | Medical specialty |
| `qualification` | String | Required | Degrees (e.g. MBBS, MD) |
| `experience` | Number | Required | Years of clinical practice |
| `consultationFee`| Number | Required | Consultation charge in INR |
| `email` | String | Required, Unique | Professional email |
| `phone` | String | Required | Office phone |
| `hospital` | String | Default: `"CareWell Hospital"`| Hospital/clinic location |
| `about` | String | Optional | Doctor's biography |
| `profileImage` | String | Optional | Avatar URL |
| `availableSlots`| Array of String | Optional | Predefined consultation hours |
| `isAvailable` | Boolean | Default: `true` | Active roster toggle |
| `isDeleted` | Boolean | Default: `false`, Indexed | Soft delete flag |

**Doctor Indexes:**
- Text index: `{ name: "text", specialization: "text", hospital: "text" }`
- Compound indexes: `{ isDeleted: 1, isAvailable: 1 }`, `{ isDeleted: 1, specialization: 1 }`

### Appointment (`appointment.js`)
| Field | Type | Attributes | Description |
|---|---|---|---|
| `patientId` | ObjectId | Ref: User, Required | Patient record reference |
| `doctorId` | ObjectId | Ref: Doctor, Required | Doctor record reference |
| `appointmentDate` | Date | Required | Scheduled appointment date |
| `appointmentTime` | String | Required | Selected time slot (e.g. "10:00 AM") |
| `reason` | String | Optional | Reason for visit / symptoms |
| `status` | String | Enum: `["Pending", "Booked", "Completed", "Cancelled"]` | Current appointment status |
| `isDeleted` | Boolean | Default: `false`, Indexed | Soft delete flag |

**Appointment Indexes:**
- **Compound Partial Unique Index:** `{ doctorId: 1, appointmentDate: 1, appointmentTime: 1 }` with `{ status: { $in: ["Pending", "Booked"] }, isDeleted: false }` to prevent double-booking at the database level.
- Compound patient lookup: `{ patientId: 1, isDeleted: 1, appointmentDate: -1 }`
- Compound doctor lookup: `{ doctorId: 1, isDeleted: 1, appointmentDate: 1 }`
- Admin lookup: `{ isDeleted: 1, status: 1, appointmentDate: -1 }`

---

# Authentication

Stateless **JWT** authentication with dual-channel transmission:
1. **Password Hashing:** Passwords hashed with `bcryptjs` and verified securely.
2. **Dual-Token Delivery:** On login/signup, the backend issues a JWT token (signed with `TOKEN_KEY`) via **both** an HTTP-only cookie and the JSON response payload.
3. **Cross-Domain Client (`apiFetch`):** The frontend client automatically includes `credentials: "include"` and transmits the `Authorization: Bearer <token>` header, preventing third-party cookie blocking on modern browsers.
4. **Role Guards (`requireAuth` & `requireRole`):** Protected routes enforce authentication and role privilege checks at the middleware layer.
5. **Independent Role Sessions:** Admin and patient sessions use independent localStorage keys (`adminUser` / `patientUser`), allowing simultaneous management and booking from the same browser.

---

# Application Workflow

```
[ User Action ]  →  [ React UI Event ]  →  [ fetch() API Call ]
                                                     |
[ DB Update ]  ←  [ Controller Logic ]  ←  [ Express Route + Middleware ]
                                                     |
                                            [ JSON Response ]
                                                     |
                                         [ React State Update → UI Re-render ]
```

---

# Design Patterns
- **MVC:** Routes → Controllers → Models separation.
- **Middleware Pattern:** CORS, cookie parsing, DB connection guard, JWT auth all run as Express middleware.
- **Guard Middleware:** Every request passes through a `connectDB()` middleware ensuring the database is always connected before queries run (critical for Vercel serverless cold starts).

---

# Security
- **Bcrypt Hashing:** Passwords hashed with 12 salt rounds — never stored as plain text.
- **httpOnly Cookies:** JWT stored in httpOnly cookies, immune to XSS attacks.
- **CORS Allowlist:** Only specific origins (localhost dev ports + Vercel frontend URL) are allowed.
- **Role Guards:** Admin routes check `user.role === 'admin'` server-side; dashboards redirect on role mismatch.
- **Error Sanitization:** Raw MongoDB/Mongoose errors are sanitized before reaching the client.

---

# Error Handling
- **Backend:** Global Express error handler returns clean JSON (`{ success: false, message: "..." }`). MongoDB timeout errors are caught and returned as user-friendly messages.
- **Frontend:** `try/catch` around all API calls with appropriate user feedback messages.
- **DB Connection:** Backend middleware calls `connectDB()` before every request, handling Vercel cold-start race conditions.

---

# Deployment

Both the frontend and backend are deployed on **Vercel** as separate projects from the same GitHub repository.

## Backend — Vercel

| Setting | Value |
|---|---|
| **Root Directory** | `backend` |
| **Build Command** | `npm install` |
| **Output Directory** | *(leave blank)* |
| **Framework Preset** | Other |

**Required Environment Variables** (Vercel Dashboard → Backend Project → Settings → Environment Variables):
```
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/Hospital-appointment-system?retryWrites=true&w=majority
TOKEN_KEY=your_strong_jwt_secret
ACCESS_CODE=your_admin_access_code
FRONTEND_URL=https://hospital-appointment-system-ten-plum.vercel.app
```

## Frontend — Vercel

| Setting | Value |
|---|---|
| **Root Directory** | `frontend` |
| **Framework Preset** | Vite |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |

**Required Environment Variables** (Vercel Dashboard → Frontend Project → Settings → Environment Variables):
```
VITE_API_URL=https://hospital-appointment-system-backend.vercel.app
```

> The `frontend/vercel.json` contains SPA rewrite rules that redirect all routes to `index.html`, fixing 404 errors on page refresh.

---

# Troubleshooting

| Problem | Cause | Solution |
|---|---|---|
| `404 NOT_FOUND` on page refresh | No SPA fallback rule | Ensure `frontend/vercel.json` exists with `"rewrites"` to `/index.html` |
| `Operation 'users.findOne()' buffering timed out` | Wrong `MONGO_URI` on Vercel | Set `MONGO_URI` to `mongodb+srv://...` (Atlas), NOT `localhost` |
| Admin and patient sessions conflicting | Shared `localStorage` key | Fixed — admin uses `adminUser` key, patient uses `patientUser` key |
| CORS errors in production | Frontend origin not in allowlist | Add `FRONTEND_URL` env var to backend on Vercel |
| Blank page after login | Wrong redirect or missing env var | Check `VITE_API_URL` is set correctly in Vercel frontend settings |

---

# Recent Updates

### 🚀 Phase 1: Security & Route Protection (Completed)
- **Role-Based Middlewares:** Implemented `requireAuth` and `requireRole("admin")` supporting dual authentication via HTTP-only cookies and `Authorization: Bearer <token>` headers.
- **Protected Endpoints:** Secured all doctor modification routes (`/doctor/add`, `/doctor/update`, `/doctor/delete`) and appointment management routes (`/appointment/book`, `/appointment/all`, `/appointment/update`, `/appointment/delete`).
- **Patient Privacy:** Restricted patients to querying and cancelling only their own appointments, preventing account/ID spoofing.
- **Double-Booking Prevention:** Added concurrency checks at controller level and a compound unique index in MongoDB on `{ doctorId, appointmentDate, appointmentTime }` for active slots.
- **Unified Frontend Client:** Introduced `apiFetch` utility (`frontend/src/utils/api.js`) to handle authenticated API calls with token and cookie synchronization across origins.

### ⚡ Phase 2: Database & Performance (Completed)
- **Soft Deletion Architecture:** Added `isDeleted: true` to both Doctor and Appointment models with updated indexes, preventing accidental data loss of medical records while preserving audit trails. Supports permanent hard delete via `?hardDelete=true`.
- **Text Search & Compound Indexing:** Added MongoDB text search index on `{ name, specialization, hospital }` and optimized lookup indexes on appointments (`patientId`, `doctorId`, `status`, `appointmentDate`).
- **Search, Filtering & Pagination:** Enabled dynamic query params on `/doctor/all` and `/appointment/all` (`search`, `specialization`, `isAvailable`, `status`, `page`, `limit`, `sortBy`, `order`) with full pagination metadata.
- **Live Doctor Directory:** Connected public `Doctors.jsx` directory to live backend API with search and category filtering.

### 🛠️ Infrastructure & Stability Fixes
- **Fix:** Added `frontend/vercel.json` rewrite rules — page refresh no longer shows 404.
- **Fix:** Doctor avatar now dynamically computes first letter of doctor's clean name, removing broken placeholder images.
- **Fix:** Separated admin and patient browser sessions into independent localStorage keys (`adminUser` / `patientUser`).
- **Fix:** Added `connectDB()` middleware that runs before every Express request — resolves MongoDB buffering timeout errors on Vercel cold starts.
- **Fix:** Migrated to `bcryptjs` for serverless runtime stability.

---

# License
This project is licensed under the **MIT License**.

---

# Author
Developed with ❤️ by the CareWell Development Team.

---

# Support
For support, open an issue on the [GitHub repository](https://github.com/zaaraf027-glitch/Hospital-appointment-system/issues).
