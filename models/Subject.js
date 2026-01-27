import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: true
  }
});

subjectSchema.index({ name: 1, class: 1 }, { unique: true });

export default mongoose.model("Subject", subjectSchema);
