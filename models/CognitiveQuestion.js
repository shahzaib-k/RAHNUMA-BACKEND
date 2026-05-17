import mongoose from "mongoose";

const cognitiveQuestionSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: ["logical", "verbal", "quantitative"],
    required: true
  },
  question: {
    type: String,
    required: true
  },
  options: {
    type: [String],
    required: true
  },
  answer: {
    type: String,
    required: true
  }
});

const CognitiveQuestion = mongoose.model("CognitiveQuestion", cognitiveQuestionSchema);

export default CognitiveQuestion;
