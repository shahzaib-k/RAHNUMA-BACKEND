import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "dummy");

export const generateAiResume = async (data) => {
  const { name, education, skills, experience, targetRole, jobDescription } = data;

  const prompt = `You are an expert resume writer and ATS optimization specialist.

Generate a professional, ATS-optimized resume in **structured JSON format**.

---

# 🎯 Instructions

* Tailor the resume for the given **target role**
* If a job description is provided, align the resume with it
* Use strong action verbs (e.g., Developed, Built, Optimized)
* Keep bullet points concise and impactful
* Ensure ATS-friendly keywords are included
* Do NOT generate generic content

---

# 📥 Input

Candidate Information:

* Name: ${name || ""}
* Education: ${education || ""}
* Skills: ${Array.isArray(skills) ? skills.join(", ") : skills || ""}
* Experience: ${experience || ""}
* Target Role: ${targetRole || ""}

Optional:

* Job Description: ${jobDescription || ""}

---

# 📤 Output Format (STRICT JSON)

{
  "summary": "2–3 line professional summary tailored to the role",
  "skills": ["relevant", "technical", "skills"],
  "experience": [
    {
      "role": "Job Title",
      "description": [
        "Bullet point with strong action verb",
        "Bullet point with measurable impact if possible"
      ]
    }
  ],
  "projects": [
    {
      "name": "Project Name",
      "description": [
        "What was built",
        "Technologies used"
      ]
    }
  ],
  "education": [
    {
      "degree": "",
      "institution": "",
      "year": ""
    }
  ]
}

---

# ⚠️ Rules

* Output ONLY JSON (no extra text)
* Do not leave fields empty — infer intelligently if needed
* Make content realistic and professional
* Prioritize clarity and ATS optimization`;

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash", generationConfig: { responseMimeType: "application/json" } });
  const response = await model.generateContent(prompt);
  const text = response.response.text();
  
  return JSON.parse(text);
};
