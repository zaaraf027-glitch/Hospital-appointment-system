# CareWell Hospital Management System
> Your Health, Our Priority — A modern, full-stack digital health ecosystem for hospital administration, doctor scheduling, and patient appointment management.

---

# Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Architecture](#project-architecture)
- [Folder Structure](#folder-structure)
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Installation](#installation)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Authentication](#authentication)
- [Application Workflow](#application-workflow)
- [Core Modules](#core-modules)
- [Design Patterns](#design-patterns)
- [State Management](#state-management)
- [Security](#security)
- [Performance Optimizations](#performance-optimizations)
- [Responsive Design](#responsive-design)
- [Error Handling](#error-handling)
- [Testing](#testing)
- [Deployment](#deployment)
- [CI/CD](#cicd)
- [Configuration](#configuration)
- [Logging & Monitoring](#logging--monitoring)
- [Troubleshooting](#troubleshooting)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [Coding Standards](#coding-standards)
- [License](#license)
- [Author](#author)
- [Acknowledgements](#acknowledgements)
- [FAQ](#faq)
- [Support](#support)
- [Conclusion](#conclusion)

---

# Overview
The **CareWell Hospital Management System** is a production-ready Web Application designed to streamline operations for medical facilities. It automates doctor management, user authentication, and patient appointment scheduling. 

- **Problem Solved:** Reduces administrative bottlenecks, eliminates scheduling conflicts, improves medical file organization, and provides an elegant dashboard for patients and hospital administrators alike.
- **Target Users:** Patients seeking medical appointments, and Hospital Administrators managing medical departments, rosters, and operational metrics.
- **Key Objectives:** Enable seamless online booking, provide high-performance reactive dashboards, ensure robust security for medical data, and establish a modular microservice-ready backend.

---

# Features
- **User Authentication:** Sign up and log in for patients and administrators with JWT-based verification, secure cookie handling, and password hashing (bcrypt).
- **Interactive Dashboards:** Elegant and user-friendly dashboards for Patients (view history, book appointments) and Admins (track statistics, manage doctors, view hospital metrics).
- **Doctor Directory Management:** Full CRUD operations for administrator-controlled doctor profiles, including descriptions, specialties, fees, and photo assets.
- **Appointment Scheduling:** Real-time booking, updates, status changes, and deletion mechanisms.
- **Dynamic Charts & Analytics:** Interactive data visualizations (Recharts) on dashboards indicating hospital occupancy, user growth, and appointment histories.

---

# Tech Stack

| Category | Technology / Library |
| :--- | :--- |
| **Programming Languages** | JavaScript (ES6+), HTML5, CSS3 |
| **Frontend Framework** | React 19, React Router DOM (v7) |
| **Backend Framework** | Node.js, Express (v5) |
| **Database** | MongoDB, Mongoose |
| **Authentication** | JSON Web Tokens (JWT), Bcrypt, Cookie Parser |
| **Build Tools** | Vite, PostCSS, `@tailwindcss/vite` |
| **Styling** | Tailwind CSS (v4) |
| **Libraries** | Lucide React (Icons), Recharts (Charts) |
| **Environment Config** | Dotenv |
| **Process Manager** | Nodemon |
| **Package Manager** | npm |
| **Version Control** | Git |

---

# Project Architecture

The system follows a classic **Client-Server-Database Architecture** split into a React frontend client and an Express REST API backend.

```
+-------------------------------------------------------------+
|                        Client Layer                         |
|      (React 19, Vite, Tailwind CSS v4, React Router)       |
+------------------------------+------------------------------+
                               |
                        HTTP Requests (JSON)
                               |
+------------------------------v------------------------------+
|                        Backend Layer                        |
|            (Express 5, Node.js, JWT, Bcrypt)               |
|                                                             |
|   +-------------------+  +-------------------+  +-------+   |
|   |   Routes Layer    |  | Controllers Layer |  | Auth  |   |
|   +-------------------+  +-------------------+  +-------+   |
+------------------------------+------------------------------+
                               |
                        Mongoose Queries
                               |
+------------------------------v------------------------------+
|                       Database Layer                        |
|                         (MongoDB)                           |
+-------------------------------------------------------------+
```

1. **Client Layer:** Renders the user interface. It requests data from the Backend Layer using standard APIs and manages views with React Router.
2. **Backend Layer:** Intercepts endpoints, authenticates tokens via custom middleware, processes business logic in Controllers, and interfaces with the Database.
3. **Database Layer:** Persists doctors, users, and appointments in MongoDB via Mongoose Schemas.

---

# Folder Structure

```
hospital-frontend/
├── backend/                       # Express server code
│   ├── Controllers/               # Business logic controllers
│   │   ├── appointmentController.js
│   │   ├── authController.js
│   │   └── doctorController.js
│   ├── Middlewares/               # Custom Express middlewares
│   │   └── authMiddlewares.js
│   ├── Models/                    # Mongoose database models
│   │   ├── appointment.js
│   │   ├── doctorModels.js
│   │   └── UserModels.js
│   ├── Routes/                    # Express routing files
│   │   ├── appointmentRoutes.js
│   │   ├── authRoutes.js
│   │   └── doctorRoutes.js
│   ├── utils/                     # Backend helper scripts
│   │   └── SecretToken.js
│   ├── .env                       # Backend local configuration
│   └── index.js                   # Application entry point
├── public/                        # Static assets (favicons, etc.)
├── src/                           # Frontend source code
│   ├── assets/                    # Local image/asset files
│   ├── components/                # Shared layout components (Navbar, Footer, Card)
│   ├── data/                      # Client mock/static data
│   ├── pages/                     # Routed page views (Home, Login, Signup, Dashboards)
│   │   ├── AdminDashboard.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Doctors.jsx
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   └── Signup.jsx
│   ├── App.css                    # Main app styling
│   ├── App.jsx                    # Root client router setup
│   ├── index.css                  # Tailwinds directives and fonts
│   └── main.jsx                   # Vite bootstrap script
├── package.json                   # Shared dependencies & scripts
├── eslint.config.js               # ESLint code style config
└── vite.config.js                 # Vite bundler configuration
```

---

# Prerequisites
Before starting, make sure you have the following installed:
- **Node.js**: `v18.x` or later (Recommended: `v20.x` LTS)
- **npm**: `v9.x` or later
- **MongoDB**: Active local instance (`localhost:27017`) or a remote MongoDB Atlas connection string.

---

# Environment Variables

Create a file named `.env` inside the `backend` folder and define the following variables:

```ini
PORT=4000
MONGO_URL=mongodb://127.0.0.1:27017/Hospital-appointment-system
TOKEN_KEY=your_secret_jwt_sign_key
```

*Note: Change `TOKEN_KEY` to a secure, randomly generated string for production environments.*

---

# Installation

To install project dependencies, run the command corresponding to your package manager of choice in the `hospital-frontend` root directory:

### npm
```bash
npm install
```

### yarn
```bash
yarn install
```

### pnpm
```bash
pnpm install
```

### bun
```bash
bun install
```

---

# Getting Started

The project runs both frontend and backend concurrently or as separate tasks.

### 1. Run the Backend Server
Navigate to the `backend` directory and run using Node:
```bash
cd backend
node index.js
```
*(Optionally, use nodemon for auto-reloading if installed globally: `nodemon index.js`)*

### 2. Run the Frontend Client
In a new terminal window at the `hospital-frontend` root, run:
```bash
npm run dev
```
Open your browser and navigate to **`http://localhost:5173`**.

---

# Available Scripts

The following scripts are defined in [package.json](file:///d:/Tech%20projects/Weintern/Weintren%20-%20week%203/Hospital%20appointment%20system/hospital-frontend/package.json):

- **`npm run dev`**: Starts the Vite development server with Hot Module Replacement (HMR).
- **`npm run build`**: Compiles the optimized static production assets into the `dist/` folder.
- **`npm run preview`**: Starts a local preview server to test production build output locally.
- **`npm run lint`**: Inspects codebase files using ESLint rules for code quality.

---

# Usage

1. **Sign Up & Sign In:** Create a patient profile or log in with existing credentials to access the user dashboard.
2. **Accessing Admin Panel:** Navigate to `/admin` to toggle admin view dashboard, manage specialists, and modify appointment logs.
3. **Book an Appointment:** From the Patient Dashboard, select a specialist, date, and description to book your appointment.
4. **Rescheduling & Cancellation:** Manage your booked slots from your client dashboard list view.

---

# API Documentation

The REST API exposes the following endpoints:

### Authentication
- `POST /signup` - Creates a new user profile.
- `POST /login` - Sign in user and retrieve cookie session.
- `POST /logout` - Clears session cookies.
- `GET /verify` - Authenticate current user via JWT middleware.

### Doctors
- `GET /doctor/all` - Get details of all registered doctors.
- `POST /doctor/add` - Register a new doctor.
- `GET /doctor/:id` - Retrieve unique doctor parameters.
- `PUT /doctor/update/:id` - Edit specific doctor properties.
- `DELETE /doctor/delete/:id` - Deletes a doctor profile.

### Appointments
- `POST /appointment/book` - Reserve a slot for a patient.
- `GET /appointment/my/:patientId` - List all appointments for a patient.
- `GET /appointment/all` - List all registered appointments (Admin view).
- `PUT /appointment/update/:id` - Edit appointment details.
- `DELETE /appointment/delete/:id` - Cancel and delete appointment.

---

# Database Schema

The database layout uses 3 key models:

### 1. User (`UserModels.js`)
- `email` (String, required, unique)
- `username` (String, required)
- `password` (String, required)
- `createdAt` (Date)

### 2. Doctor (`doctorModels.js`)
- `name` (String, required)
- `specialty` (String, required)
- `experience` (Number, required)
- `fees` (Number, required)
- `rating` (Number, default: 5)
- `availability` (String, default: "Available")

### 3. Appointment (`appointment.js`)
- `doctorId` (Mongoose Schema ObjectId, ref: 'Doctor')
- `patientId` (Mongoose Schema ObjectId, ref: 'User')
- `date` (String, required)
- `time` (String, required)
- `status` (String, default: 'Pending')
- `description` (String)

---

# Authentication

Secure authentication is handled using stateless **JSON Web Tokens (JWT)**:
1. When a user logs in, their password is verified using `bcrypt.compare`.
2. A JWT token containing the User ID is generated and signed with the server's `TOKEN_KEY`.
3. The token is stored securely in the user's browser inside an `httpOnly` cookie.
4. Subsequent calls pass the cookie, which is intercepted and decrypted by the `VerifyUser` middleware.

---

# Application Workflow

```
[ User Interaction ]  -->  [ React UI Event ]  -->  [ Axios API Call ]
                                                            |
[ Database Update ]   <--  [ Controller Handler ] <-- [ Router/Middleware ]
```

1. **User requests** to view their dashboard or book an appointment.
2. **Frontend** issues an API request passing session tokens/cookies.
3. **Backend Middleware** intercepts the request and verifies the session token validity.
4. **Backend Controllers** process the requests, reading/writing to the database.
5. **JSON Response** returns to the client, triggering UI updates with React state.

---

# Design Patterns
- **MVC (Model-View-Controller):** Structured modular routing separating database layouts (Models), endpoint routing (Routes), and logic handlers (Controllers).
- **Middleware Pattern:** Seamless hook points in the request-response lifecycle (e.g. CORS, cookie parsers, token check verification).

---

# State Management
The project utilizes native **React Hook state mechanisms (`useState`, `useEffect`)** inside page-level wrapper components to handle reactive variables, loading templates, and user logs.

---

# Security
- **Bcrypt Hashing:** Passwords are never stored as plain text. They are hashed using a workload factor (salt rounds: 10) before MongoDB entry.
- **httpOnly Cookies:** Session tokens are transmitted via secure cookie headers to shield against Cross-Site Scripting (XSS) injection.
- **CORS Configuration:** Enables API security filters ensuring resource access is limited to client hosts.

---

# Performance Optimizations
- **Vite Bundler:** Instant Hot Module Replacement and production chunk splitting.
- **Tailwind CSS v4:** Zero-runtime utility classes for fast layout generation and rendering.

---

# Responsive Design
CareWell is built using a mobile-first responsive Grid and Flexbox layout structure. Utilizing Tailwind’s responsive breakpoint modifiers (`sm:`, `md:`, `lg:`), the dashboard adapts seamlessly to tablets, laptops, and wide desktop screens.

---

# Error Handling
Both clients and controllers implement try-catch blocks:
- **Client Side:** Intercepts API error states, preventing page crashes and displaying user-friendly error banners.
- **Server Side:** Centralized try-catch logic yielding standard JSON errors (e.g., `500 Internal Server Error` or `401 Unauthorized`).

---

# Testing
- **Manual Verification:** Functionality has been validated through iterative visual checks, form submission assertions, and console logs.
- **API Testing:** Verified endpoint parameters using testing software and tools.

---

# Deployment
- **Frontend Hosting:** Build artifacts inside `dist/` can be deployed directly to static hosts like **Vercel, Netlify, or AWS S3**.
- **Backend Hosting:** Node server can run on containerized PaaS platforms like **Render, Heroku, or railway.app**.

---

# License
This project is licensed under the MIT License - see the LICENSE file for details.

---

# Author
Developed with ❤️ by the CareWell Development Team.

---

# FAQ

**Q: Can I run this database on MongoDB Atlas instead of localhost?**  
A: Yes! Simply update `MONGO_URL` in your `backend/.env` with your remote MongoDB Atlas connection string.

**Q: What is the default port for the frontend?**  
A: Vite starts the frontend on port `5173` by default.

---

# Support
For support, search the repository issues page or submit a pull request with bug fixes or suggestions.

---

# Conclusion
CareWell Hospital Management System provides a solid foundation for any digital hospital administration project. With standard clean-code patterns, responsive design, and modular backend routing, it can scale easily to fit production deployment requirements.
