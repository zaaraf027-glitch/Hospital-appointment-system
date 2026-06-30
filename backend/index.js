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
    
    // Seed initial doctors if database is empty
    try {
      const count = await Doctor.countDocuments();
      if (count === 0) {
        const initialDoctors = [
          {
            name: "Dr. Ananya Sharma",
            specialization: "Cardiologist",
            qualification: "MBBS, MD Cardiology",
            experience: 12,
            consultationFee: 700,
            email: "ananya.sharma@carewell.com",
            phone: "+91 9876543201",
            hospital: "MediCare Hospital",
            about: "Experienced cardiologist specializing in heart failure and rhythm disorders.",
            profileImage: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300",
            availableSlots: ["10:00 AM", "11:30 AM", "02:00 PM", "04:30 PM"]
          },
          {
            name: "Dr. Rahul Verma",
            specialization: "Dentist",
            qualification: "BDS, MDS",
            experience: 8,
            consultationFee: 400,
            email: "rahul.verma@carewell.com",
            phone: "+91 9876543202",
            hospital: "Smile Dental Clinic",
            about: "Expert in cosmetic dentistry and root canal treatments.",
            profileImage: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300",
            availableSlots: ["09:00 AM", "12:00 PM", "03:00 PM", "06:00 PM"]
          },
          {
            name: "Dr. Priya Desai",
            specialization: "Dermatologist",
            qualification: "MBBS, MD Dermatology",
            experience: 10,
            consultationFee: 600,
            email: "priya.desai@carewell.com",
            phone: "+91 9876543203",
            hospital: "Skin & Hair Clinic",
            about: "Specializes in clinical dermatology and aesthetic treatments.",
            profileImage: "https://images.unsplash.com/photo-1594824436998-d1dc57ab5549?auto=format&fit=crop&q=80&w=300&h=300",
            availableSlots: ["10:30 AM", "01:00 PM", "04:00 PM"]
          },
          {
            name: "Dr. Amit Singh",
            specialization: "Pediatrician",
            qualification: "MBBS, MD Pediatrics",
            experience: 15,
            consultationFee: 500,
            email: "amit.singh@carewell.com",
            phone: "+91 9876543204",
            hospital: "City Child Care",
            about: "Dedicated pediatrician focusing on newborn and child care.",
            profileImage: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300&h=300",
            availableSlots: ["08:00 AM", "11:00 AM", "05:00 PM"]
          },
          {
            name: "Dr. Vikram Gupta",
            specialization: "Orthopedic Surgeon",
            qualification: "MBBS, MS Orthopedics",
            experience: 20,
            consultationFee: 800,
            email: "vikram.gupta@carewell.com",
            phone: "+91 9876543205",
            hospital: "Bone & Joint Centre",
            about: "Renowned orthopedic surgeon specializing in joint replacement.",
            profileImage: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300&h=300",
            availableSlots: ["09:30 AM", "02:30 PM", "06:30 PM"]
          },
          {
            name: "Dr. Neha Kapoor",
            specialization: "Neurologist",
            qualification: "MBBS, MD, DM Neurology",
            experience: 14,
            consultationFee: 900,
            email: "neha.kapoor@carewell.com",
            phone: "+91 9876543206",
            hospital: "Neuro Care Hospital",
            about: "Expert in treating complex neurological disorders and stroke.",
            profileImage: "https://images.unsplash.com/photo-1527613426401-41d31cb12f20?auto=format&fit=crop&q=80&w=300&h=300",
            availableSlots: ["11:00 AM", "01:30 PM", "04:30 PM"]
          }
        ];
        await Doctor.insertMany(initialDoctors);
        console.log("🌱 Database seeded with initial doctors successfully!");
      }
    } catch (seedErr) {
      console.error("❌ Failed to seed database:", seedErr.message);
    }
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(process.env.PORT, () => {
  console.log(`Server running on ${process.env.PORT}`);
});
