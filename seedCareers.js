import mongoose from "mongoose";
import dotenv from "dotenv";
import Career from "./models/Career.js";
import { connectDB } from "./config/db.js";

dotenv.config();

const seedCareers = [
  {
    title: "Software Engineer",
    cognitiveWeights: { logical: 0.5, quantitative: 0.3, verbal: 0.2 },
    personalityWeights: { openness: 0.3, conscientiousness: 0.4, extraversion: 0.1, agreeableness: 0.1, neuroticism: -0.2 }
  },
  {
    title: "Data Scientist",
    cognitiveWeights: { logical: 0.4, quantitative: 0.5, verbal: 0.1 },
    personalityWeights: { openness: 0.3, conscientiousness: 0.4, extraversion: 0.1, agreeableness: 0.1, neuroticism: -0.1 }
  },
  {
    title: "Designer",
    cognitiveWeights: { logical: 0.2, quantitative: 0.1, verbal: 0.7 },
    personalityWeights: { openness: 0.6, conscientiousness: 0.2, extraversion: 0.2, agreeableness: 0.2, neuroticism: 0.1 }
  },
  {
    title: "Teacher",
    cognitiveWeights: { logical: 0.2, quantitative: 0.2, verbal: 0.6 },
    personalityWeights: { openness: 0.3, conscientiousness: 0.4, extraversion: 0.5, agreeableness: 0.5, neuroticism: -0.2 }
  },
  {
    title: "Marketing Specialist",
    cognitiveWeights: { logical: 0.2, quantitative: 0.2, verbal: 0.6 },
    personalityWeights: { openness: 0.4, conscientiousness: 0.3, extraversion: 0.6, agreeableness: 0.3, neuroticism: -0.1 }
  },
  {
    title: "Psychologist",
    cognitiveWeights: { logical: 0.3, quantitative: 0.1, verbal: 0.6 },
    personalityWeights: { openness: 0.5, conscientiousness: 0.3, extraversion: 0.4, agreeableness: 0.6, neuroticism: -0.1 }
  },
  {
    title: "Accountant",
    cognitiveWeights: { logical: 0.4, quantitative: 0.5, verbal: 0.1 },
    personalityWeights: { openness: 0.1, conscientiousness: 0.7, extraversion: 0.1, agreeableness: 0.2, neuroticism: -0.1 }
  },
  {
    title: "Entrepreneur",
    cognitiveWeights: { logical: 0.4, quantitative: 0.3, verbal: 0.3 },
    personalityWeights: { openness: 0.5, conscientiousness: 0.5, extraversion: 0.6, agreeableness: 0.4, neuroticism: -0.2 }
  }
];

const seedDB = async () => {
  try {
    await connectDB();
    
    // Clear existing careers to avoid duplicates
    await Career.deleteMany({});
    console.log("Cleared existing careers...");

    // Insert seeds
    await Career.insertMany(seedCareers);
    console.log("Successfully seeded careers!");
    
    process.exit(0);
  } catch (error) {
    console.error("Error seeding careers:", error);
    process.exit(1);
  }
};

seedDB();
