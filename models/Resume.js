import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  resumeData: {
    type: Object,
    required: true,
  }
}, { timestamps: true });

export default mongoose.model("Resume", resumeSchema);
