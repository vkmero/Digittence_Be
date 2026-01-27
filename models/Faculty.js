import mongoose from "mongoose";

const facultySchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,

  resetToken: String,
  resetTokenExpiry: Date
});

export default mongoose.model("Faculty", facultySchema);