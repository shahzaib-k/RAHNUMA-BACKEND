import fs from "fs";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");
import { GoogleGenerativeAI } from "@google/generative-ai";
import AtsResult from "../models/AtsResult.js";

// Initialize Gemini AI Client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const uploadAndAnalyze = async (req, res) => {
  try {
    // Extracted strictly from verifyToken
    const userId = req.user?.id;
    if (!userId) {
      return res.status(400).json({ message: "User not authenticated" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No resume file provided." });
    }

    let resumeText = "";
    if (req.file.mimetype === "application/pdf") {
      const dataBuffer = fs.readFileSync(req.file.path);
      const data = await pdfParse(dataBuffer);
      resumeText = data.text;
    } else if (req.file.mimetype === "text/plain") {
      resumeText = fs.readFileSync(req.file.path, "utf-8");
    } else {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: "Invalid file format. Please upload PDF or TXT." });
    }

    // Cleanup local cache from multer
    fs.unlinkSync(req.file.path);

    if (!resumeText || resumeText.trim().length === 0) {
      return res.status(400).json({ message: "Could not extract text from the resume." });
    }

    // Performance Optimization: Cache Check
    // If exact same user analyzes same top bytes of resume recently, prevent AI duplicate spam limit
    const hashCheck = resumeText.trim().substring(0, 1000);
    const existing = await AtsResult.findOne({ 
      userId, 
      resumeText: { $regex: `^${hashCheck.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}` }
    }).sort({ createdAt: -1 });

    if (existing) {
      // Short circuit optimization
      return res.status(200).json(existing);
    }

    // Prepare exactly requested Gemini prompt constraints
    const prompt = `You are an ATS (Applicant Tracking System) resume evaluator.

Analyze the following resume text and evaluate it based on standard ATS criteria.

Resume:
"""
${resumeText.substring(0, 15000)}
"""

Return the response in STRICT JSON format:

{
  "ats_score": number (0-100),
  "keyword_match": {
    "matched": ["list of relevant keywords found"],
    "missing": ["important missing keywords"]
  },
  "formatting_issues": ["list of formatting problems"],
  "strengths": ["list of strong points"],
  "improvements": ["specific suggestions to improve ATS score"],
  "summary": "short overall evaluation"
}

Evaluation Criteria:
- Keyword relevance (skills, roles, technologies)
- Resume structure and readability
- Section completeness (education, experience, skills)
- ATS compatibility (simple formatting, no complex layouts)

Keep the response concise, structured, and professional.
Do NOT include any explanation outside JSON.`;

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash", 
      generationConfig: { responseMimeType: "application/json" } 
    });

    const result = await model.generateContent(prompt);
    const aiResponse = result.response.text();
    const parsedData = JSON.parse(aiResponse);

    // Storing output directly based on required flow
    const atsRecord = new AtsResult({
      userId,
      resumeText: resumeText.substring(0, 3000), // optional stored trimmed sample to fulfill cached schema safely
      atsScore: parsedData.ats_score,
      feedback: parsedData
    });

    await atsRecord.save();
    res.status(200).json(atsRecord);

  } catch (error) {
    console.error("ATS upload error:", error);
    res.status(500).json({ message: "Error analyzing resume", error: error.message });
  }
};

export const getAtsScore = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(400).json({ message: "User not authenticated" });
    }

    const latestResult = await AtsResult.findOne({ userId }).sort({ createdAt: -1 });
    if (!latestResult) {
      return res.status(404).json({ message: "No ATS score found" });
    }

    res.status(200).json(latestResult);
  } catch (error) {
    console.error("Get ATS Error:", error);
    res.status(500).json({ message: "Error fetching ATS score", error: error.message });
  }
};
