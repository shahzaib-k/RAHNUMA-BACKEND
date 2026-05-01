import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "dummy");

export const calculateAtsScore = async (resumeData, jobDescription) => {
  const prompt = `You are an expert ATS (Applicant Tracking System) Analyzer.
  
Analyze this resume against standard ATS rules, and specifically against the provided job description if available.

Resume Data:
${JSON.stringify(resumeData, null, 2)}

Job Description (Optional):
${jobDescription || "None provided. Score based on general best practices."}

Analyze:
1. Keywords match (especially if jobDescription provided)
2. Formatting quality and section completeness
3. Bullet strength (use of action verbs, metrics)

Return ONLY valid JSON matching this exact structure:
{
  "score": 78,
  "suggestions": ["Add more action verbs", "Include keywords like React"]
}
`;

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash", generationConfig: { responseMimeType: "application/json" } });
  const response = await model.generateContent(prompt);
  const text = response.response.text();
  
  return JSON.parse(text);
};
