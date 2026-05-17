import express from "express";
import { getQuestions, submitAnswers, getResult, getAllQuestionsAdmin, addQuestion, updateQuestion, deleteQuestion } from "../controllers/personalityController.js";
import { verifyToken, isAdmin } from "../utils/verifyToken.js";

const router = express.Router();

router.get("/questions", getQuestions);
router.post("/submit", submitAnswers);
router.get("/result", getResult);

// Admin routes
router.get("/admin/questions", verifyToken, isAdmin, getAllQuestionsAdmin);
router.post("/admin/questions", verifyToken, isAdmin, addQuestion);
router.put("/admin/questions/:id", verifyToken, isAdmin, updateQuestion);
router.delete("/admin/questions/:id", verifyToken, isAdmin, deleteQuestion);

export default router;
