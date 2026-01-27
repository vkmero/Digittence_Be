import mongoose from "mongoose";

const classSchema = new mongoose.Schema({
  className: String,
  faculty: { type: mongoose.Schema.Types.ObjectId, ref: "Faculty" }
});

export default mongoose.model("Class", classSchema);
