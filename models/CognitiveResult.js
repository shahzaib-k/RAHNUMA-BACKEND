import mongoose from "mongoose";

const cognitiveResultSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  logical: {
    type: Number,
    required: true,
  },
  verbal: {
    type: Number,
    required: true,
  },
  quantitative: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

export default mongoose.model("CognitiveResult", cognitiveResultSchema);
