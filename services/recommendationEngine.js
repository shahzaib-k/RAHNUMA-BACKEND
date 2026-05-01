import CognitiveResult from "../models/CognitiveResult.js";
import PersonalityResult from "../models/PersonalityResult.js";
import Career from "../models/Career.js";

/**
 * Generate career recommendations based on cognitive and personality scores.
 * @param {string} userId
 * @returns {Promise<Array>} top 5 recommendations
 */
export const generateRecommendations = async (userId) => {
  // Fetch user cognitive + personality results
  // We sort by createdAt -1 to get the most recent score if multiple exist
  const cognitive = await CognitiveResult.findOne({ userId }).sort({ createdAt: -1 });
  const personality = await PersonalityResult.findOne({ userId }).sort({ createdAt: -1 });

  if (!cognitive || !personality) {
    throw new Error("Missing cognitive or personality results for user.");
  }

  // Normalize user scores (score / 100)
  const normCog = {
    logical: cognitive.logical / 100,
    verbal: cognitive.verbal / 100,
    quantitative: cognitive.quantitative / 100
  };

  const normPer = {
    openness: personality.openness / 100,
    conscientiousness: personality.conscientiousness / 100,
    extraversion: personality.extraversion / 100,
    agreeableness: personality.agreeableness / 100,
    neuroticism: personality.neuroticism / 100
  };

  // Fetch all careers
  const careers = await Career.find();

  const recommendations = [];

  for (const career of careers) {
    // Cognitive Score
    const cogScore = 
      (normCog.logical * career.cognitiveWeights.logical) +
      (normCog.quantitative * career.cognitiveWeights.quantitative) +
      (normCog.verbal * career.cognitiveWeights.verbal);

    // Personality Score
    const perScore = 
      (normPer.openness * career.personalityWeights.openness) +
      (normPer.conscientiousness * career.personalityWeights.conscientiousness) +
      (normPer.extraversion * career.personalityWeights.extraversion) +
      (normPer.agreeableness * career.personalityWeights.agreeableness) +
      (normPer.neuroticism * career.personalityWeights.neuroticism);

    // Combine: finalScore = (0.6 * cognitive) + (0.4 * personality)
    const finalScore = (0.6 * cogScore) + (0.4 * perScore);

    // Convert to confidence (0-100)
    let confidence = Math.round(finalScore * 100);
    
    // Safety check just in case weights result in > 100 or < 0
    if (confidence > 100) confidence = 100;
    if (confidence < 0) confidence = 0;

    recommendations.push({
      career: career.title,
      confidence
    });
  }

  // Sort by confidence descending
  recommendations.sort((a, b) => b.confidence - a.confidence);
  
  // Return top 5 careers
  return recommendations.slice(0, 5);
};
