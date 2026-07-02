import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import User from "./Models/UserModels.js";
import Doctor from "./Models/doctorModels.js";

const app = express();
const router = express.Router();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

import testRoutes from "./Routes/authRoutes.js";
app.use("/", testRoutes);

import doctorRoutes from "./Routes/doctorRoutes.js";
import appointmentroutes from "./Routes/appointmentRoutes.js";
app.use("/doctor", doctorRoutes);
app.use("/appointment", appointmentroutes);

// Health check — shows a friendly page when visiting http://localhost:4000
app.get("/", (req, res) => {
  res.json({
    status: "✅ CareWell Backend is Running",
    version: "1.0.0",
    endpoints: {
      auth: ["POST /signup", "POST /login", "POST /logout", "GET /verify"],
      doctors: ["GET /doctor/all", "POST /doctor/add", "PUT /doctor/update/:id", "DELETE /doctor/delete/:id"],
      appointments: ["POST /appointment/book", "GET /appointment/all", "GET /appointment/my/:patientId", "PUT /appointment/update/:id", "DELETE /appointment/delete/:id"]
    }
  });
});

mongoose
  .connect(process.env.MONGO_URL)
  .then(async () => {
    console.log("✅ Database Connected");
    
  })
   

app.listen(process.env.PORT, () => {
  console.log(`Server running on ${process.env.PORT}`);
});
