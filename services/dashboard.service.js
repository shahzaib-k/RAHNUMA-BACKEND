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
  const prompt = `You are a professional career counselor. Based on the following user assessment scores and recommended careers, write exactly one professional, personalized paragraph (3-4 sentences). Explain their dominant strengths, behavioral tendencies, what kind of careers fit them, and why these recommendations were generated.

Scores:
- Logical: ${scores.logical}%
- Verbal: ${scores.verbal}%
- Quantitative: ${scores.quantitative}%
- Openness: ${scores.openness}%
- Conscientiousness: ${scores.conscientiousness}%
- Extraversion: ${scores.extraversion}%
- Agreeableness: ${scores.agreeableness}%
- Neuroticism: ${scores.neuroticism}%

Top Recommended Careers:
${topCareers.map(c => c.career).join(", ")}

Output only the paragraph, nothing else.`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const response = await model.generateContent(prompt);
    return response.response.text().trim();
  } catch (error) {
    console.error("Error generating AI insight:", error);
    return "Based on your combined assessment, you possess a solid foundation for careers that leverage your unique mix of problem-solving skills and personality traits.";
  }
};
