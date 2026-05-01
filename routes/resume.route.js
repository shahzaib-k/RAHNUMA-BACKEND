import express from "express";
import { 
  generateResume, 
  enhanceResumeSection, 
  checkAtsScore, 
  getResumeById 
} from "../controllers/resume.controller.js";

const router = express.Router();

router.post("/generate", generateResume);
router.post("/enhance", enhanceResumeSection);
router.post("/ats-check", checkAtsScore);
router.get("/:id", getResumeById);

export default router;