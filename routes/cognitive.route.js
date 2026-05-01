import express from "express";
import { getQuestions, submitAnswers } from "../controllers/cognitive.controller.js";

const cognitiveRoute = express.Router();

cognitiveRoute.get("/questions", getQuestions);
cognitiveRoute.post("/submit", submitAnswers);

export default cognitiveRoute;
