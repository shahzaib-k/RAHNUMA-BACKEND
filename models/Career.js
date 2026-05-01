import mongoose from "mongoose";

const careerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  cognitiveWeights: {
    logical: { type: Number, default: 0 },
    verbal: { type: Number, default: 0 },
    quantitative: { type: Number, default: 0 }
  },
  personalityWeights: {
    openness: { type: Number, default: 0 },
    conscientiousness: { type: Number, default: 0 },
    extraversion: { type: Number, default: 0 },
    agreeableness: { type: Number, default: 0 },
    neuroticism: { type: Number, default: 0 }
  }
}, { timestamps: true });

export default mongoose.model("Career", careerSchema);
