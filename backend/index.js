import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./Routes/authRoutes.js";
import doctorRoutes from "./Routes/doctorRoutes.js";
import appointmentRoutes from "./Routes/appointmentRoutes.js";

const app = express();

// ── CORS ──────────────────────────────────────────────────────────────────────
// Allow both local dev and the deployed Vercel frontend
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:4173",
  process.env.FRONTEND_URL, // set this in Render env vars to your Vercel URL
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS policy: origin ${origin} not allowed`));
    },
    credentials: true,
  })
);

// ── MIDDLEWARE ────────────────────────────────────────────────────────────────
app.use(express.json());
app.use(cookieParser());

// ── ROUTES ────────────────────────────────────────────────────────────────────
app.use("/", authRoutes);
app.use("/doctor", doctorRoutes);
app.use("/appointment", appointmentRoutes);

// ── HEALTH CHECK ──────────────────────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.json({
    status: "✅ CareWell Backend is Running",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    endpoints: {
      auth:         ["POST /signup", "POST /login", "POST /logout", "GET /verify"],
      doctors:      ["GET /doctor/all", "POST /doctor/add", "GET /doctor/:id", "PUT /doctor/update/:id", "DELETE /doctor/delete/:id"],
      appointments: ["POST /appointment/book", "GET /appointment/all", "GET /appointment/my/:patientId", "PUT /appointment/update/:id", "DELETE /appointment/delete/:id"],
    },
  });
});

// ── DATABASE ──────────────────────────────────────────────────────────────────
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ FATAL: MONGO_URI environment variable is not set.");
  console.error("   Set it in backend/.env (locally) or in Render Environment Variables.");
  process.exit(1); // Exit immediately so Render knows the deploy failed
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ Database Connected to MongoDB Atlas");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1); // Crash fast so Render restarts the service
  });

// ── SERVER ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export default app;
