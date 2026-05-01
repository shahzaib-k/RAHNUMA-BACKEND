import express from "express";
import { getQuestions, submitAnswers, getResult } from "../controllers/personalityController.js";

const router = express.Router();

router.get("/questions", getQuestions);
router.post("/submit", submitAnswers);
router.get("/result", getResult);

export default router;
