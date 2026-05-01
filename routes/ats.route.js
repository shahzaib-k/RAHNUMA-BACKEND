import express from "express";
import multer from "multer";
import { uploadAndAnalyze, getAtsScore } from "../controllers/ats.controller.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // Automatically creates backend/uploads tmp storage chunkings

router.post("/upload-resume", verifyToken, upload.single("resume"), uploadAndAnalyze);
router.get("/ats-score", verifyToken, getAtsScore);

export default router;
