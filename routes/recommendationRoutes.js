import express from "express";
import { getRecommendations } from "../controllers/recommendationController.js";

const router = express.Router();

// GET /api/recommendations/?userId=123
router.get("/", getRecommendations);

export default router;
