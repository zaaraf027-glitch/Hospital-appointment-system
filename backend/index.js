import dotenv from "dotenv";

// ── LOAD ENV VARS ─────────────────────────────────────────────────────────────
// dotenv.config() with NO arguments reads from .env in the current working
// directory when running locally. On Vercel, the .env file is NOT deployed —
// Vercel injects env vars directly from the dashboard, so this is a no-op and
// that is perfectly fine. DO NOT use a __dirname-based path here; that approach
// breaks inside Vercel's bundler because import.meta.url resolves to a virtual
// path that doesn't sit next to the original .env file.
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./Routes/authRoutes.js";
import doctorRoutes from "./Routes/doctorRoutes.js";
import appointmentRoutes from "./Routes/appointmentRoutes.js";

const app = express();

// ── CORS ──────────────────────────────────────────────────────────────────────
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:4173",
  process.env.FRONTEND_URL,
].filter(Boolean).map(url => url.replace(/\/$/, ""));

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      const cleanOrigin = origin.replace(/\/$/, "");
      if (allowedOrigins.includes(cleanOrigin)) return callback(null, true);
      callback(new Error(`CORS policy: origin ${origin} not allowed`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  })
);

// Handle preflight OPTIONS for all routes
app.options("*", cors());

// ── MIDDLEWARE ────────────────────────────────────────────────────────────────
app.use(express.json());
app.use(cookieParser());

// ── REQUEST LOGGER ────────────────────────────────────────────────────────────
// Logs every incoming request with method, path, status code, and duration.
// Visible in Vercel Function Logs — essential for debugging prod crashes.
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.path} → ${res.statusCode} (${duration}ms)`
    );
  });
  next();
});

// ── ROUTES ────────────────────────────────────────────────────────────────────
app.use("/", authRoutes);
app.use("/doctor", doctorRoutes);
app.use("/appointment", appointmentRoutes);

// ── ROOT & HEALTH ROUTES ──────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Hospital Appointment Backend is running successfully 🚀",
  });
});

app.get("/health", (req, res) => {
  const dbStates = ["disconnected", "connected", "connecting", "disconnecting"];
  res.status(200).json({
    status: "✅ CareWell Backend is Running",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    database: {
      state: dbStates[mongoose.connection.readyState] || "unknown",
      connected: mongoose.connection.readyState === 1,
    },
    env: {
      MONGO_URI: process.env.MONGO_URI ? "✅ set" : "❌ MISSING",
      TOKEN_KEY: process.env.TOKEN_KEY ? "✅ set" : "❌ MISSING",
      ACCESS_CODE: process.env.ACCESS_CODE ? "✅ set" : "❌ MISSING",
      FRONTEND_URL: process.env.FRONTEND_URL ? "✅ set" : "⚠️ not set (CORS may block frontend)",
    },
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
  console.error(
    "❌ FATAL: MONGO_URI environment variable is not set.\n" +
    "   → For local dev: add MONGO_URI to backend/.env\n" +
    "   → For Vercel: add MONGO_URI in the Vercel dashboard → Settings → Environment Variables\n" +
    "   → Value must be a MongoDB Atlas URI (mongodb+srv://...), NOT localhost"
  );
}

// Cache the connection across warm invocations (avoids re-connecting on every request)
let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  if (!MONGO_URI) throw new Error("MONGO_URI is not defined — cannot connect to database");

  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 10000, // 10 s — fail fast if Atlas is unreachable
      socketTimeoutMS: 45000,
    });
    isConnected = true;
    console.log("✅ Database connected to MongoDB Atlas");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    throw err;
  }
};

// Attempt to connect immediately (warm start caching)
connectDB().catch(err =>
  console.error("⚠️ Startup DB connection error (will retry on next request):", err.message)
);

// ── GLOBAL ERROR HANDLER ──────────────────────────────────────────────────────
// Catches any unhandled error thrown by route handlers and returns valid JSON.
// Without this, Express would send an HTML error page → not valid JSON → Vercel
// would itself return 500 with a generic error.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error("❌ Unhandled error:", err.stack || err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

// ── SERVER (local dev only) ───────────────────────────────────────────────────
// Vercel does NOT need app.listen() — it uses the exported app directly.
// We only start the HTTP server when running locally.
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Local server running on http://localhost:${PORT}`);
  });
}

export default app;
