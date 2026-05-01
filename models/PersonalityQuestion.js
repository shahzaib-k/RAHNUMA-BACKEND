import mongoose from "mongoose";

const personalityQuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  trait: {
    type: String,
    enum: ["openness", "conscientiousness", "extraversion", "agreeableness", "neuroticism"],
    required: true,
  },
  reverse: {
    type: Boolean,
    default: false,
  },
  options: {
    type: [Number],
    default: [1, 2, 3, 4, 5],
  },
});

const PersonalityQuestion = mongoose.model("PersonalityQuestion", personalityQuestionSchema);

export default PersonalityQuestion;
