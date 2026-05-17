import express from "express";
import { getQuestions, submitAnswers, getAllQuestionsAdmin, addQuestion, updateQuestion, deleteQuestion } from "../controllers/cognitive.controller.js";
import { verifyToken, isAdmin } from "../utils/verifyToken.js";

const cognitiveRoute = express.Router();

cognitiveRoute.get("/questions", getQuestions);
cognitiveRoute.post("/submit", submitAnswers);

// Admin routes
cognitiveRoute.get("/admin/questions", verifyToken, isAdmin, getAllQuestionsAdmin);
cognitiveRoute.post("/admin/questions", verifyToken, isAdmin, addQuestion);
cognitiveRoute.put("/admin/questions/:id", verifyToken, isAdmin, updateQuestion);
cognitiveRoute.delete("/admin/questions/:id", verifyToken, isAdmin, deleteQuestion);

export default cognitiveRoute;
