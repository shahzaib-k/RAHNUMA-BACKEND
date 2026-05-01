import express from "express";
import { getDashboardIntelligence } from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get("/intelligence/:userId", getDashboardIntelligence);

export default router;
