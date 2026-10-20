import mongoose from "mongoose";
import Doctor from "../Models/doctorModels.js";

export const addDoctor = async (req, res) => {
  try {
    const {
      name,
      specialization,
      qualification,
      experience,
      consultationFee,
      email,
      phone,
      hospital,
      about,
      availableSlots,
    } = req.body;

    if (!name || !specialization || !qualification || !experience || !consultationFee || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: name, specialization, qualification, experience, consultationFee, email, and phone are required.",
      });
    }

    const existingDoctor = await Doctor.findOne({ email: email.toLowerCase().trim() });
    if (existingDoctor) {
      return res.status(409).json({
        success: false,
        message: "A doctor with this email already exists.",
      });
    }

    const doctor = await Doctor.create({
      name: name.trim(),
      specialization: specialization.trim(),
      qualification: qualification.trim(),
      experience: Number(experience),
      consultationFee: Number(consultationFee),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      hospital: hospital || "CareWell Hospital",
      about: about || "",
      availableSlots: availableSlots || [],
    });

    return res.status(201).json({
      success: true,
      message: "Doctor added successfully",
      doctor,
    });
  } catch (err) {
    console.error("[addDoctor] Error:", err.message);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to add doctor",
    });
  }
};

export const getAllDoctors = async (req, res) => {
  try {
    const {
      page,
      limit,
      search,
      specialization,
      isAvailable,
      sortBy,
      order,
    } = req.query;

    const filter = { isDeleted: false };

    // Search by doctor name, specialty, or hospital
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");
      filter.$or = [
        { name: searchRegex },
        { specialization: searchRegex },
        { hospital: searchRegex },
      ];
    }

    // Filter by exact specialty if specified
    if (specialization && specialization !== "All") {
      filter.specialization = specialization.trim();
    }

    // Filter by availability if specified
    if (isAvailable !== undefined) {
      filter.isAvailable = isAvailable === "true" || isAvailable === true;
    }

    // Dynamic sorting
    const validSortFields = ["name", "experience", "consultationFee", "createdAt"];
    const sortField = validSortFields.includes(sortBy) ? sortBy : "createdAt";
    const sortOrder = order === "asc" ? 1 : -1;
    const sort = { [sortField]: sortOrder };

    const total = await Doctor.countDocuments(filter);

    let doctors;
    let pageNum = 1;
    let totalPages = 1;

    // Apply pagination if requested
    if (page !== undefined || limit !== undefined) {
      pageNum = Math.max(1, parseInt(page) || 1);
      const limitNum = Math.max(1, Math.min(100, parseInt(limit) || 10));
      const skip = (pageNum - 1) * limitNum;
      totalPages = Math.ceil(total / limitNum) || 1;

      doctors = await Doctor.find(filter).sort(sort).skip(skip).limit(limitNum);
    } else {
      // Default: return all matching documents for full backwards compatibility
      doctors = await Doctor.find(filter).sort(sort);
      totalPages = 1;
    }

    return res.status(200).json({
      success: true,
      count: doctors.length,
      total,
      totalPages,
      currentPage: pageNum,
      doctors,
    });
  } catch (err) {
    console.error("[getAllDoctors] Error:", err.message);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid doctor ID format.",
      });
    }

    const doctor = await Doctor.findOne({ _id: id, isDeleted: false });
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found or has been deactivated.",
      });
    }

    return res.status(200).json({
      success: true,
      doctor,
    });
  } catch (err) {
    console.error("[getDoctorById] Error:", err.message);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const updateDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid doctor ID format.",
      });
    }

    const updatedDoctor = await Doctor.findOneAndUpdate(
      { _id: id, isDeleted: false },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedDoctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Doctor updated successfully",
      doctor: updatedDoctor,
    });
  } catch (err) {
    console.error("[updateDoctor] Error:", err.message);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to update doctor",
    });
  }
};

export const deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const { hardDelete } = req.query;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid doctor ID format.",
      });
    }

    let deletedDoctor;
    if (hardDelete === "true") {
      deletedDoctor = await Doctor.findByIdAndDelete(id);
    } else {
      // Standard safe soft delete
      deletedDoctor = await Doctor.findOneAndUpdate(
        { _id: id, isDeleted: false },
        { isDeleted: true },
        { new: true }
      );
    }

    if (!deletedDoctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: hardDelete === "true" ? "Doctor permanently deleted" : "Doctor deactivated successfully (soft delete)",
      doctor: deletedDoctor,
    });
  } catch (err) {
    console.error("[deleteDoctor] Error:", err.message);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to delete doctor",
    });
  }
};
