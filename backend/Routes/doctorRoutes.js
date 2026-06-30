import express from "express";
import {addDoctor,getAllDoctors,getDoctorById,updateDoctor,deleteDoctor} from "../Controllers/doctorController.js";


const router = express.Router();
router.post("/add",addDoctor);
router.get("/all",getAllDoctors);
router.get("/:id",getDoctorById);
router.put("/update/:id",updateDoctor);
router.delete("/delete/:id",deleteDoctor);



export default router;