import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    specialization: {
      type: String,
      required: true,
    },

    qualification: {
      type: String,
      required: true,
    },

    experience: {
      type: Number,
      required: true,
    },

    consultationFee: {
      type: Number,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
    },

    hospital: {
      type: String,
      default: "CareWell Hospital",
    },

    about: {
      type: String,
      default: "",
    },

    profileImage: {
      type: String,
      default: "",
    },

    availableSlots: [
      {
        type: String,
      },
    ],

    isAvailable: {
      type: Boolean,
      default: true,
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

// Text search index for searching doctors by name, specialty, or hospital
doctorSchema.index({ name: "text", specialization: "text", hospital: "text" });

// Performance compound indexes for common queries
doctorSchema.index({ isDeleted: 1, isAvailable: 1 });
doctorSchema.index({ isDeleted: 1, specialization: 1 });

const Doctor = mongoose.model("Doctor", doctorSchema);

export default Doctor;