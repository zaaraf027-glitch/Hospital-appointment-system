import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
dotenv.config();

async function fixAdminRoles() {
  await mongoose.connect(process.env.MONGO_URL);
  console.log("Connected to DB");

  const User = mongoose.model("User", new mongoose.Schema({
    username: String,
    email: String,
    password: { type: String, required: true },
    role: String,
    phone: String,
    gender: String,
    address: String,
  }));

  // Hash new password "123456"
  const hashedPassword = await bcrypt.hash("123456", 10);

  // Update password and role
  const result = await User.updateOne(
    { email: "abdulaltamash020@gmail.com" },
    { $set: { role: "admin", password: hashedPassword } }
  );
  console.log(`\nUpdated abdulaltamash020@gmail.com:`, result.modifiedCount > 0 ? "SUCCESS" : "Not updated/not found");

  // Show updated users
  const updated = await User.find({}, "username email role");
  console.log("\n=== Updated Users ===");
  updated.forEach(u => console.log(`  ${u.username} | ${u.email} | role: ${u.role}`));

  await mongoose.disconnect();
  console.log("\nDone!");
}

fixAdminRoles().catch(console.error);
