import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "dummy");

export const generateAptitudeSummary = (logical, verbal, quantitative) => {
  const l = Number(logical) || 0;
  const v = Number(verbal) || 0;
  const q = Number(quantitative) || 0;

  if (l === 0 && v === 0 && q === 0) {
    return "You have a balanced foundation. More data is needed to identify a dominant aptitude.";
  }

  if (l >= v && l >= q) {
    return "You demonstrate strong analytical and problem-solving ability.";
  } else if (v >= l && v >= q) {
    return "You show strong communication and comprehension skills.";
  } else {
    return "You possess above-average numerical and mathematical reasoning.";
  }
};

export const generateAiInsight = async (scores, topCareers) => {
  // AI Personalized Insight disabled per request. Returning default message directly.
  return "Based on your combined assessment, you possess a solid foundation for careers that leverage your unique mix of problem-solving skills and personality traits.";
};
