# CareWell Hospital — Deployment Guide

## Project Structure

```
Hospital-appointment-system/
├── backend/          ← Deploy to Render
│   ├── Controllers/
│   ├── Middlewares/
│   ├── Models/
│   ├── Routes/
│   ├── utils/
│   ├── index.js
│   ├── package.json
│   └── .env.example
├── src/              ← Frontend source (lives in root for Vercel)
├── public/
├── index.html
├── vite.config.js
└── package.json      ← Frontend package.json
```

---

## 🖥️ Backend — Deploy to Render

### 1. MongoDB Atlas Setup
- Create a free cluster at [https://cloud.mongodb.com](https://cloud.mongodb.com)
- Go to **Database Access** → Add a user with read/write permissions
- Go to **Network Access** → Add IP `0.0.0.0/0` (allow all, required for Render)
- Go to **Clusters** → Connect → Get the connection string:
  ```
  mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/Hospital-appointment-system
  ```

### 2. Render Web Service Settings
| Field | Value |
|---|---|
| **Repository** | Your GitHub repo URL |
| **Root Directory** | `backend` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Environment** | Node |

### 3. Render Environment Variables
Add these in Render → Service → **Environment**:

```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/Hospital-appointment-system
TOKEN_KEY=your_strong_jwt_secret_here
ACCESS_CODE=your_admin_access_code
```

> ⚠️ Never use `mongodb://127.0.0.1:27017` — this only works locally, not on Render.

---

## 🌐 Frontend — Deploy to Vercel

### 1. Vercel Project Settings
| Field | Value |
|---|---|
| **Framework Preset** | Vite |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Root Directory** | `.` (project root) |

### 2. Vercel Environment Variables
Add this in Vercel → Project → **Settings → Environment Variables**:

```
VITE_API_URL=https://your-render-backend-url.onrender.com
```

> Replace `your-render-backend-url` with the actual URL Render gives you.

---

## 💻 Running Locally

### Backend
```bash
cd backend
# Create your .env file
cp .env.example .env
# Fill in your MONGO_URI and TOKEN_KEY
npm install
npm run dev
```

### Frontend
```bash
# In root directory
# Create a .env.local file
echo "VITE_API_URL=http://localhost:5000" > .env.local
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

### Frontend (`.env.local`)
| Variable | Description | Example |
|---|---|---|
| `VITE_API_URL` | Backend API base URL | `https://your-app.onrender.com` |
