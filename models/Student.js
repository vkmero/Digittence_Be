import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: String,
  rollNo: {
    type: String,
    required: true
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: true
  }
});

studentSchema.index(
  { rollNo: 1, class: 1 },
  { unique: true }
);

const Student = mongoose.model("Student", studentSchema);
Student.syncIndexes(); 

export default Student;
