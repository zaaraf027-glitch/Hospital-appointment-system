import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import User from "./Models/UserModels.js";
const app = express();
const router = express.Router();
app.use(express.json());
const { MONGO_URL, PORT } = process.env;
dotenv.config();
import testRoutes from "./Routes/authRoutes.js";
app.use(cookieParser());
app.use("/",testRoutes);
import doctorRoutes from "./Routes/doctorRoutes.js";

app.use("/doctor",doctorRoutes);


mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("✅ Database Connected");
  })
  .catch((err) => {
    console.log(err);
  });

  
app.listen(process.env.PORT, () => {
  console.log(`Server running on ${process.env.PORT}`);
});
