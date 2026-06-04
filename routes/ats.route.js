import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import os from "os"; // <-- Import OS module
import { uploadAndAnalyze, getAtsScore } from "../controllers/ats.controller.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

// Define upload directory pointing to the serverless-writable /tmp directory
const uploadDir = path.join(os.tmpdir(), "uploads");

// Ensure the directory exists dynamically at execution time
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  dest: uploadDir,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ["application/pdf", "text/plain"];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new Error("Invalid file format. Please upload PDF or TXT."));
    }
    cb(null, true);
  },
});

const uploadResume = (req, res, next) => {
  upload.single("resume")(req, res, (error) => {
    if (!error) {
      return next();
    }

    if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ message: "Resume file is too large. Please upload a file under 5MB." });
    }

    return res.status(400).json({ message: error.message || "Could not upload resume." });
  });
};

router.post("/upload-resume", verifyToken, uploadResume, uploadAndAnalyze);
router.get("/ats-score", verifyToken, getAtsScore);

export default router;