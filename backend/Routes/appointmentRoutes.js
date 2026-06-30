import express from "express";
import {bookAppointment,getMyAppointments,getAllAppointments,updateAppointments} from "../Controllers/appointmentController.js";
import { deleteAppointments } from "../Controllers/appointmentController.js";
const router = express.Router();


router.post("/book",bookAppointment);
router.get("/my/:patientId",getMyAppointments);
router.get("/all",getAllAppointments);
router.put("/update/:id",updateAppointments);
router.delete("/delete/:id",deleteAppointments);
export default router;