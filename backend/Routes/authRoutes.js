import express from "express";
const router = express.Router();
import {
  Signup,
  Login,
  Logout,
  VerifyUser,
} from "../Controllers/authController.js";

router.post("/signup", Signup);
router.post("/login", Login);
router.post("/logout", Logout);
router.get("/verify", VerifyUser);

export default router;
