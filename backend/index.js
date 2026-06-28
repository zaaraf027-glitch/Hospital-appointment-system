
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const { MONGO_URL, PORT } = process.env;
const cookieParser = require("cookie-parser");








const authRoute = require("./routes/authRoutes");
mongoose
  .connect(MONGO_URL)
  .then(() => console.log("Server is listening on port 4000"))
  .catch((err) => console.log(err));

app.listen(PORT, () => {
  console.log(`app is running on ${PORT}`);
});
app.use(
  cors({
    origin: ["http://localhost:5173"],
    method: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);
app.use(cookieParser());

app.use(express.json());

app.use("/", authRoute);
