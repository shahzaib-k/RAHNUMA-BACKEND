import mongoose from "mongoose";

const atsResultSchema = new mongoose.Schema({
  userId: {
    type: String, // String to seamlessly support valid tokens id format
    required: true,
  },
  resumeText: {
    type: String,
  },
  atsScore: {
    type: Number,
    required: true,
  },
  feedback: {
    type: Object, // Stores exact ATS JSON mapping from gemini (keyword_match, formatting_issues, strengths, improvements, summary)
    required: true,
  }
}, { timestamps: true });

export default mongoose.model("AtsResult", atsResultSchema);
