import { generateRecommendations } from "../services/recommendationEngine.js";
import Recommendation from "../models/Recommendation.js";

export const getRecommendations = async (req, res) => {
  try {
    const userId = req.query.userId || req.body.userId;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const topCareers = await generateRecommendations(userId);

    // Save recommendations history
    await Recommendation.create({
      userId,
      recommendations: topCareers
    });

    res.status(200).json(topCareers);
  } catch (error) {
    console.error("Error generating recommendations:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};
