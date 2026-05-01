import Resume from "../models/Resume.js";
import { generateAiResume } from "../services/aiResumeGenerator.js";
import { enhanceSection } from "../services/aiEnhancer.js";
import { calculateAtsScore } from "../services/atsChecker.js";

export const generateResume = async (req, res) => {
  try {
    const userId = req.user?.id || req.body.userId || "guest";
    const { name, education, skills, experience, targetRole, jobDescription } = req.body;

    if (!name || !education || !skills || !targetRole) {
      return res.status(400).json({ error: "Missing required fields: name, education, skills, targetRole" });
    }

    const generatedData = await generateAiResume({
      name,
      education,
      skills,
      experience,
      targetRole,
      jobDescription
    });

    const newResume = new Resume({ userId, resumeData: generatedData });
    await newResume.save();

    res.status(200).json({ 
      message: "Resume generated successfully",
      resumeId: newResume._id,
      resumeData: generatedData 
    });
  } catch (error) {
    console.error("Error generating resume:", error);
    res.status(500).json({ error: error.message || "Failed to generate resume" });
  }
};

export const enhanceResumeSection = async (req, res) => {
  try {
    const { sectionContent, enhancementType, targetRole } = req.body;
    
    if (!sectionContent || !enhancementType) {
      return res.status(400).json({ error: "Missing sectionContent or enhancementType" });
    }

    const improvedVersion = await enhanceSection(sectionContent, enhancementType, targetRole);

    res.status(200).json({ improvedContent: improvedVersion });
  } catch (error) {
    console.error("Error enhancing section:", error);
    res.status(500).json({ error: "Failed to enhance section" });
  }
};

export const checkAtsScore = async (req, res) => {
  try {
    const { resumeId, jobDescription, resumeData } = req.body;
    
    let resumeToAnalyze = resumeData;

    if (resumeId && !resumeData) {
      const existingResume = await Resume.findById(resumeId);
      if (!existingResume) {
        return res.status(404).json({ error: "Resume not found" });
      }
      resumeToAnalyze = existingResume.resumeData;
    }

    if (!resumeToAnalyze) {
      return res.status(400).json({ error: "Please provide either resumeId or resumeData" });
    }

    const atsResult = await calculateAtsScore(resumeToAnalyze, jobDescription);

    res.status(200).json(atsResult);
  } catch (error) {
    console.error("Error calculating ATS score:", error);
    res.status(500).json({ error: "Failed to calculate ATS score" });
  }
};

export const getResumeById = async (req, res) => {
  try {
    const { id } = req.params;
    const resume = await Resume.findById(id);

    if (!resume) {
      return res.status(404).json({ error: "Resume not found" });
    }

    res.status(200).json(resume);
  } catch (error) {
    console.error("Error fetching resume:", error);
    res.status(500).json({ error: "Failed to fetch resume" });
  }
};