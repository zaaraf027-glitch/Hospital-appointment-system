# CareWell Hospital — Deployment Guide

## Project Structure

```
Hospital-appointment-system/
├── backend/                  ← Express REST API (Deploy to Render or Vercel)
│   ├── Controllers/
│   ├── Middlewares/
│   ├── Models/
│   ├── Routes/
│   ├── utils/
│   ├── index.js
│   ├── package.json
│   ├── vercel.json
│   └── .env.example
├── frontend/                 ← React + Vite SPA (Deploy to Vercel)
│   ├── public/
│   ├── src/
│   ├── index.html
│   ├── package.json
│   ├── vercel.json
│   ├── vite.config.js
│   └── .env.example
├── .gitignore
├── .env.example
└── README.md
```

---

## 🖥️ Backend — Deploy to Render / Vercel

### 1. MongoDB Atlas Setup
- Create a free cluster at [https://cloud.mongodb.com](https://cloud.mongodb.com)
- Go to **Database Access** → Add a user with read/write permissions
- Go to **Network Access** → Add IP `0.0.0.0/0` (allow all, required for cloud hosting)
- Go to **Clusters** → Connect → Get the connection string:
  ```
  mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/Hospital-appointment-system
  ```

### 2. Render Web Service Settings (or Vercel)
| Field | Value |
|---|---|
| **Repository** | Your GitHub repo URL |
| **Root Directory** | `backend` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Environment** | Node |

### 3. Backend Environment Variables
Add these in your hosting dashboard (Render / Vercel):

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/Hospital-appointment-system
TOKEN_KEY=your_strong_jwt_secret_here
ACCESS_CODE=your_admin_access_code
FRONTEND_URL=https://your-frontend.vercel.app
```

> ⚠️ Never use `mongodb://127.0.0.1:27017` in production — local addresses do not work on cloud hosts.

---

## 🌐 Frontend — Deploy to Vercel

### 1. Vercel Project Settings
| Field | Value |
|---|---|
| **Framework Preset** | Vite |
| **Root Directory** | `frontend` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |

### 2. Vercel Environment Variables
Add this in Vercel → Project → **Settings → Environment Variables**:

```env
VITE_API_URL=https://your-backend-url.onrender.com
```

> Replace `your-backend-url` with your actual deployed backend URL (Render or Vercel).

---

## 💻 Running Locally

### Backend
```bash
cd backend
cp .env.example .env
# Fill in your MONGO_URI, TOKEN_KEY, and ACCESS_CODE in .env
npm install
npm run dev
```

### Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔑 Environment Variables Reference

### Backend (`backend/.env`)
| Variable | Description | Example |
|---|---|---|
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://...` |
| `TOKEN_KEY` | JWT signing secret | `my_strong_secret` |
| `ACCESS_CODE` | Admin signup access code | `admin123` |
| `FRONTEND_URL` | Allowed frontend origin for CORS | `https://your-app.vercel.app` |

### Frontend (`frontend/.env` or `frontend/.env.local`)
| Variable | Description | Example |
|---|---|---|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000` |
