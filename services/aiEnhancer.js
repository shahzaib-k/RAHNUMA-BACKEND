import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "dummy");

export const enhanceSection = async (sectionContent, enhancementType, targetRole) => {
  let instruction = "";
  
  switch (enhancementType) {
    case "Improve Summary":
      instruction = "Rewrite this professional summary to make it highly impactful, concise, and ATS-friendly. Focus heavily on achievements and the target role.";
      break;
    case "Rewrite Experience":
      instruction = "Rewrite this experience description using the STAR method (Situation, Task, Action, Result). Highlight technical impact and business value.";
      break;
    case "Add Action Verbs":
      instruction = "Rewrite this text by replacing weak verbs with strong, active power verbs (e.g., spearheaded, architected, orchestrated).";
      break;
    case "Optimize for ATS":
      instruction = "Rewrite this text to be maximally optimized for an ATS system for the target role. Naturally integrate relevant industry keywords.";
      break;
    default:
      instruction = "Improve the professionalism and impact of this text.";
  }

  const prompt = `You are a Resume Formatting AI expert.
  
Instruction: ${instruction}
Target Role: ${targetRole || "General Professional"}
  
Original Text: 
"""
${(typeof sectionContent === 'object') ? JSON.stringify(sectionContent, null, 2) : sectionContent}
"""
  
Return ONLY the improved text string. If the input was structured data like bullet points, return bullet points or structured text. Do NOT include markdown blocks like \`\`\`json. Return pure text or perfectly formatted JSON if the input was JSON.`;

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const response = await model.generateContent(prompt);
  return response.response.text().trim();
};
