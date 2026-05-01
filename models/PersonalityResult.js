import mongoose from "mongoose";

const personalityResultSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  openness: {
    type: Number,
    required: true,
  },
  conscientiousness: {
    type: Number,
    required: true,
  },
  extraversion: {
    type: Number,
    required: true,
  },
  agreeableness: {
    type: Number,
    required: true,
  },
  neuroticism: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const PersonalityResult = mongoose.model("PersonalityResult", personalityResultSchema);

export default PersonalityResult;
