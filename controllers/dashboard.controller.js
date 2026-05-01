                                                                                                                         import CognitiveResult from "../models/CognitiveResult.js";
import PersonalityResult from "../models/PersonalityResult.js";
import { generateRecommendations } from "../services/recommendationEngine.js";
import { generateAptitudeSummary, generateAiInsight } from "../services/dashboard.service.js";

export const getDashboardIntelligence = async (req, res) => {
  try {
    const { userId } = req.params;

    const cognitive = await CognitiveResult.findOne({ userId }).sort({ createdAt: -1 });
    const personality = await PersonalityResult.findOne({ userId }).sort({ createdAt: -1 });

    if (!cognitive || !personality) {
      return res.status(404).json({ message: "Incomplete assessment data. Both cognitive and personality tests are required." });
    }

    const { logical, verbal, quantitative } = cognitive;
    const { openness, conscientiousness, extraversion, agreeableness, neuroticism } = personality;

    const summary = generateAptitudeSummary(logical, verbal, quantitative);

    const careerRecommendations = await generateRecommendations(userId);

    const scores = { logical, verbal, quantitative, openness, conscientiousness, extraversion, agreeableness, neuroticism };
    const aiInsight = await generateAiInsight(scores, careerRecommendations);

    res.status(200).json({
      aptitudeResult: {
        logical,
        verbal,
        quantitative,
        summary
      },
      careerRecommendations,
      aiInsight
    });
  } catch (error) {
    console.error("Error in getDashboardIntelligence:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
