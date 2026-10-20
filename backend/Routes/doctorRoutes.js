import express from "express";
import {
  addDoctor,
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
} from "../Controllers/doctorController.js";
import { requireAuth, requireRole } from "../Middlewares/authMiddlewares.js";

const router = express.Router();

// Public doctor directory
router.get("/all", getAllDoctors);
router.get("/:id", getDoctorById);

// Admin-only management
router.post("/add", requireAuth, requireRole("admin"), addDoctor);
router.put("/update/:id", requireAuth, requireRole("admin"), updateDoctor);
router.delete("/delete/:id", requireAuth, requireRole("admin"), deleteDoctor);

export default router;