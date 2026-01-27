import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  faculty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Faculty",
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  hours: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ["P", "A"],
    required: true
  }
});

attendanceSchema.index(
  { student: 1, class: 1, subject: 1, date: 1 },
  { unique: true }
);

export default mongoose.model("Attendance", attendanceSchema);
