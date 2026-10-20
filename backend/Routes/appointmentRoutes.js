import express from "express";
import {
  bookAppointment,
  getMyAppointments,
  getAllAppointments,
  updateAppointments,
  deleteAppointments,
} from "../Controllers/appointmentController.js";
import { requireAuth, requireRole } from "../Middlewares/authMiddlewares.js";

const router = express.Router();

// Authenticated booking & viewing
router.post("/book", requireAuth, bookAppointment);
router.get("/my/:patientId", requireAuth, getMyAppointments);

// Admin-only listing of all appointments
router.get("/all", requireAuth, requireRole("admin"), getAllAppointments);

// Updating status (patients can cancel own; admins can change to any status)
router.put("/update/:id", requireAuth, updateAppointments);

// Admin-only cancellation/deletion
router.delete("/delete/:id", requireAuth, requireRole("admin"), deleteAppointments);

export default router;