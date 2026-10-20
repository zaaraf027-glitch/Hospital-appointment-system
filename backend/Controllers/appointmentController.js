import mongoose from "mongoose";
import Appointment from "../Models/appointment.js";
import Doctor from "../Models/doctorModels.js";
import User from "../Models/UserModels.js";

/**
 * Book an appointment
 * Validates inputs, doctor availability, checks for double-booking,
 * and links to authenticated user.
 */
export const bookAppointment = async (req, res) => {
  try {
    let { patientId, doctorId, appointmentDate, appointmentTime, reason } = req.body;

    // If authenticated, ensure patients book for themselves; admins may book for any patient
    if (req.user) {
      if (req.user.role === "patient") {
        patientId = req.user._id;
      } else if (!patientId) {
        patientId = req.user._id;
      }
    }

    // Validate required fields
    if (!patientId || !doctorId || !appointmentDate || !appointmentTime) {
      return res.status(400).json({
        success: false,
        message: "patientId, doctorId, appointmentDate, and appointmentTime are required.",
      });
    }

    // Validate MongoDB ObjectIds
    if (!mongoose.Types.ObjectId.isValid(patientId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid patient ID format.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid doctor ID format.",
      });
    }

    // Validate patient exists
    const patient = await User.findById(patientId);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient account not found.",
      });
    }

    // Validate doctor exists and is active
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found.",
      });
    }

    if (doctor.isAvailable === false) {
      return res.status(400).json({
        success: false,
        message: `Dr. ${doctor.name} is currently not accepting appointments.`,
      });
    }

    // Validate date format and ensure it is not in the past
    const bookingDate = new Date(appointmentDate);
    if (isNaN(bookingDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment date provided.",
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const bookingDay = new Date(bookingDate);
    bookingDay.setHours(0, 0, 0, 0);

    if (bookingDay < today) {
      return res.status(400).json({
        success: false,
        message: "Cannot book an appointment for a past date.",
      });
    }

    // Concurrency / Double-booking prevention check:
    // Check if another active appointment (Pending or Booked) already exists for this doctor on the same day and time
    const startOfDay = new Date(bookingDate);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(bookingDate);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const conflictingAppointment = await Appointment.findOne({
      doctorId,
      appointmentTime: appointmentTime.trim(),
      appointmentDate: { $gte: startOfDay, $lte: endOfDay },
      status: { $in: ["Pending", "Booked"] },
      isDeleted: false,
    });

    if (conflictingAppointment) {
      return res.status(409).json({
        success: false,
        message: `The slot "${appointmentTime}" on ${bookingDate.toDateString()} is already booked with Dr. ${doctor.name}. Please choose another time.`,
      });
    }

    const appointment = await Appointment.create({
      patientId,
      doctorId,
      appointmentDate: bookingDate,
      appointmentTime: appointmentTime.trim(),
      reason: reason || "",
      status: "Pending",
      isDeleted: false,
    });

    return res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      appointment,
    });
  } catch (err) {
    console.error("[bookAppointment] Error:", err);

    // Handle Mongo duplicate key error (code 11000 from unique compound index)
    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "This appointment slot was just reserved by someone else. Please choose another slot.",
      });
    }

    return res.status(500).json({
      success: false,
      message: err.message || "Failed to book appointment.",
    });
  }
};

/**
 * Get appointments for a specific patient
 */
export const getMyAppointments = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { status, page, limit } = req.query;

    if (!mongoose.Types.ObjectId.isValid(patientId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid patient ID format.",
      });
    }

    // If user is authenticated as patient, prevent them from accessing other patients' appointments
    if (req.user && req.user.role === "patient" && req.user._id.toString() !== patientId) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You are not authorized to view this patient's appointments.",
      });
    }

    const filter = { patientId, isDeleted: false };
    if (status) {
      filter.status = status;
    }

    const total = await Appointment.countDocuments(filter);

    let query = Appointment.find(filter)
      .populate("doctorId", "name specialization qualification experience consultationFee hospital profileImage")
      .sort({ appointmentDate: -1, createdAt: -1 });

    let pageNum = 1;
    let totalPages = 1;

    if (page !== undefined || limit !== undefined) {
      pageNum = Math.max(1, parseInt(page) || 1);
      const limitNum = Math.max(1, Math.min(100, parseInt(limit) || 10));
      const skip = (pageNum - 1) * limitNum;
      totalPages = Math.ceil(total / limitNum) || 1;
      query = query.skip(skip).limit(limitNum);
    }

    const appointments = await query;

    return res.status(200).json({
      success: true,
      count: appointments.length,
      total,
      totalPages,
      currentPage: pageNum,
      appointments,
    });
  } catch (err) {
    console.error("[getMyAppointments] Error:", err.message);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * Get all appointments (Admin) with filtering & pagination
 */
export const getAllAppointments = async (req, res) => {
  try {
    const {
      status,
      doctorId,
      patientId,
      date,
      page,
      limit,
      sortBy,
      order,
    } = req.query;

    const filter = { isDeleted: false };

    if (status && ["Pending", "Booked", "Completed", "Cancelled"].includes(status)) {
      filter.status = status;
    }

    if (doctorId && mongoose.Types.ObjectId.isValid(doctorId)) {
      filter.doctorId = doctorId;
    }

    if (patientId && mongoose.Types.ObjectId.isValid(patientId)) {
      filter.patientId = patientId;
    }

    if (date) {
      const parsedDate = new Date(date);
      if (!isNaN(parsedDate.getTime())) {
        const start = new Date(parsedDate);
        start.setUTCHours(0, 0, 0, 0);
        const end = new Date(parsedDate);
        end.setUTCHours(23, 59, 59, 999);
        filter.appointmentDate = { $gte: start, $lte: end };
      }
    }

    const total = await Appointment.countDocuments(filter);

    const sortField = ["appointmentDate", "createdAt", "status"].includes(sortBy) ? sortBy : "appointmentDate";
    const sortOrder = order === "asc" ? 1 : -1;
    const sort = { [sortField]: sortOrder, createdAt: -1 };

    let query = Appointment.find(filter)
      .populate("patientId", "username email phone")
      .populate("doctorId", "name specialization hospital consultationFee")
      .sort(sort);

    let pageNum = 1;
    let totalPages = 1;

    if (page !== undefined || limit !== undefined) {
      pageNum = Math.max(1, parseInt(page) || 1);
      const limitNum = Math.max(1, Math.min(100, parseInt(limit) || 10));
      const skip = (pageNum - 1) * limitNum;
      totalPages = Math.ceil(total / limitNum) || 1;
      query = query.skip(skip).limit(limitNum);
    }

    const appointments = await query;

    return res.status(200).json({
      success: true,
      count: appointments.length,
      total,
      totalPages,
      currentPage: pageNum,
      appointments,
    });
  } catch (err) {
    console.error("[getAllAppointments] Error:", err.message);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * Update appointment status (Admin or Patient cancellation)
 */
export const updateAppointments = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment ID format.",
      });
    }

    const validStatuses = ["Pending", "Booked", "Completed", "Cancelled"];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }

    const appointment = await Appointment.findOne({ _id: id, isDeleted: false });
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found or has been deleted.",
      });
    }

    // Role-based restrictions:
    // Patients can only cancel their own appointments
    if (req.user && req.user.role === "patient") {
      if (appointment.patientId.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: "Forbidden: You cannot modify another patient's appointment.",
        });
      }
      if (status !== "Cancelled") {
        return res.status(403).json({
          success: false,
          message: "Patients may only cancel their appointments.",
        });
      }
    }

    appointment.status = status;
    await appointment.save();

    return res.status(200).json({
      success: true,
      message: "Appointment updated successfully",
      appointment,
    });
  } catch (err) {
    console.error("[updateAppointments] Error:", err.message);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * Delete appointment (Admin only) with Soft Delete
 */
export const deleteAppointments = async (req, res) => {
  try {
    const { id } = req.params;
    const { hardDelete } = req.query;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment ID format.",
      });
    }

    let deletedAppointment;
    if (hardDelete === "true") {
      deletedAppointment = await Appointment.findByIdAndDelete(id);
    } else {
      // Safe soft delete to preserve medical & billing records
      deletedAppointment = await Appointment.findOneAndUpdate(
        { _id: id, isDeleted: false },
        { isDeleted: true },
        { new: true }
      );
    }

    if (!deletedAppointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: hardDelete === "true" ? "Appointment permanently deleted" : "Appointment archived successfully (soft delete)",
      appointment: deletedAppointment,
    });
  } catch (err) {
    console.error("[deleteAppointments] Error:", err.message);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
