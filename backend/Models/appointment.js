import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },

    appointmentDate: {
      type: Date,
      required: true,
    },

    appointmentTime: {
      type: String,
      required: true,
    },

    reason: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Booked",
        "Completed",
        "Cancelled",
      ],
      default: "Pending",
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent double booking at the database level for active, non-deleted appointments
appointmentSchema.index(
  { doctorId: 1, appointmentDate: 1, appointmentTime: 1 },
  {
    unique: true,
    partialFilterExpression: { status: { $in: ["Pending", "Booked"] }, isDeleted: false },
  }
);

// Performance index for patient appointment history
appointmentSchema.index({ patientId: 1, isDeleted: 1, appointmentDate: -1 });

// Performance index for doctor appointment queries
appointmentSchema.index({ doctorId: 1, isDeleted: 1, appointmentDate: 1 });

// Performance index for admin queries
appointmentSchema.index({ isDeleted: 1, status: 1, appointmentDate: -1 });

const Appointment = mongoose.model(
  "Appointment",
  appointmentSchema
);

export default Appointment;