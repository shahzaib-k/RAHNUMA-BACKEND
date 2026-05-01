import mongoose from "mongoose";

const recommendationSchema = new mongoose.Schema({
  userId: {
    type: String, // String works since we saw it used as String in PersonalityResult
    required: true,
  },
  recommendations: [
    {
      career: { type: String, required: true },
      confidence: { type: Number, required: true },
    }
  ],
}, { timestamps: true });

export default mongoose.model("Recommendation", recommendationSchema);
