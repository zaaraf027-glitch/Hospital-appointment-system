import Appointment from "../Models/appointment.js";
import Doctor from "../Models/doctorModels.js";
import User from "../Models/UserModels.js";

export const bookAppointment = async (req, res) => {
  try {
    const { patientId, doctorId, appointmentDate, appointmentTime } = req.body;
    const patient = await User.findById(patientId);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "doctor not found",
      });
    }
    const appointment = await Appointment.create({
      patientId,
      doctorId,
      appointmentDate,
      appointmentTime,
      status: "Pending",
    });
    return res.status(201).json({
      success: true,
      message: "Appointment booked",
      appointment,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getMyAppointments = async (req, res) => {
  try {
    const { patientId } = req.params;
    const appointments = await Appointment.find({ patientId }).populate(
      "doctorId",
    );
    return res.status(200).json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().populate(
      "patientId").populate("doctorId");
    
    return res.status(200).json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


export const updateAppointments = async (req,res)=>{
    try{
        const {id} = req.params;
        const {status} = req.body;

        const appointment = await Appointment.findById(id);


        if(!appointment){
             return res.status(404).json({
      success: false,
      message: "Appointment not found",
    });
        }
        appointment.status = status;
        await appointment.save();
        return res.status(201).json({
      success: true,
      message: "Appointment updated successfully",
        });
    }
    catch(err){
        return res.status(500).json({
      success: false,
      message: err.message,
    });
    }
}

export const deleteAppointments = async (req,res)=>{
    try{
        const {id} = req.params;

        const appointment = await Appointment.findById(id);


        if(!appointment){
             return res.status(404).json({
      success: false,
      message: "Appointment not found",
    });
        }
        await Appointment.findByIdAndDelete(id);
        return res.status(201).json({
      success: true,
      message: "Appointment updated successfully",
        });
    }
    catch(err){
        return res.status(500).json({
      success: false,
      message: err.message,
    });
    }
}