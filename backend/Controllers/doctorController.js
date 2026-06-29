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
    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) {
      return res.status(400).json({
        status: false,
        message: "Doctor already exists",
      });
    }
    const doctor = await Doctor.create({
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
    });
    return res.status(201).json({
      success: true,
      message: "doctor added successfully",
      doctor,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};



export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    return res.status(201).json({
      success: true,
      count: doctors.length,
      doctors,
    });
  } catch (err) {
    return res.status(400).json({
      succes: false,
      message: err.message,
    });
  }
};



export const getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;
    const doctor = await Doctor.findById(id);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }
    return res.status(200).json({
      success: true,
      doctor,
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: err.message,
    });
  }
};



export const updateDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const doctor = await Doctor.findById(id);
    // console.log(doctor);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "no any doctor is found",
      });
    }
    // console.log("here");
    
    const updatedDoctor =await  Doctor.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    // console.log("now");

    return res.status(200).json({
      success: true,
      message: "Doctor Updated SuccessFully",
      doctor: updatedDoctor,
    });
  } catch (err) {
    return res.status(404).json({
      success: false,
      message: "Doctor not found",
    });
  }
};


export const deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const doctor = await Doctor.findById(id);
    // console.log(doctor);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "no any doctor is found",
      });
    }
    // console.log("here");
    
    const updatedDoctor =await  Doctor.findByIdAndDelete(id);
    // console.log("now");

    return res.status(200).json({
      success: true,
      message: "Doctor deleted SuccessFully",
      doctor: updatedDoctor,
    });
  } catch (err) {
    return res.status(404).json({
      success: false,
      message: "Doctor not found",
    });
  }
};