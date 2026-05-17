import PersonalityQuestion from '../models/PersonalityQuestion.js';
import PersonalityResult from '../models/PersonalityResult.js';

const seedQuestions = [
  // Openness
  { question: "I enjoy trying new and foreign foods.", trait: "openness", reverse: false },
  { question: "I have a rich vocabulary.", trait: "openness", reverse: false },
  { question: "I prefer routine to variety.", trait: "openness", reverse: true },
  { question: "I am interested in abstract ideas.", trait: "openness", reverse: false },
  { question: "I do not have a good imagination.", trait: "openness", reverse: true },
  
  // Conscientiousness
  { question: "I am always prepared.", trait: "conscientiousness", reverse: false },
  { question: "I leave my belongings around.", trait: "conscientiousness", reverse: true },
  { question: "I pay attention to details.", trait: "conscientiousness", reverse: false },
  { question: "I find it difficult to get down to work.", trait: "conscientiousness", reverse: true },
  { question: "I follow a schedule.", trait: "conscientiousness", reverse: false },
  
  // Extraversion
  { question: "I am the life of the party.", trait: "extraversion", reverse: false },
  { question: "I don't talk a lot.", trait: "extraversion", reverse: true },
  { question: "I feel comfortable around people.", trait: "extraversion", reverse: false },
  { question: "I keep in the background.", trait: "extraversion", reverse: true },
  { question: "I start conversations.", trait: "extraversion", reverse: false },
  
  // Agreeableness
  { question: "I sympathize with others' feelings.", trait: "agreeableness", reverse: false },
  { question: "I am not interested in other people's problems.", trait: "agreeableness", reverse: true },
  { question: "I feel others' emotions.", trait: "agreeableness", reverse: false },
  { question: "I am hard to get to know.", trait: "agreeableness", reverse: true },
  { question: "I make people feel at ease.", trait: "agreeableness", reverse: false },
  
  // Neuroticism
  { question: "I get stressed out easily.", trait: "neuroticism", reverse: false },
  { question: "I am relaxed most of the time.", trait: "neuroticism", reverse: true },
  { question: "I worry about things.", trait: "neuroticism", reverse: false },
  { question: "I seldom feel blue.", trait: "neuroticism", reverse: true },
  { question: "I am easily disturbed.", trait: "neuroticism", reverse: false },
];

export const getQuestions = async (req, res) => {
  try {
    // 1. Seed at least 25 personality questions if the database is empty
    const count = await PersonalityQuestion.countDocuments();
    if (count === 0) {
      await PersonalityQuestion.insertMany(seedQuestions);
      console.log("Database seeded with 25 personality questions.");
    }
    
    // 2. Fetch up to 20 personality test questions
    const questions = await PersonalityQuestion.find().limit(20);
    
    // 3. Format response (map _id to id)
    const formattedQuestions = questions.map(q => ({
      id: q._id,
      question: q.question,
      trait: q.trait,
      reverse: q.reverse
    }));
    
    // 4. Return questions
    res.status(200).json(formattedQuestions);
  } catch (error) {
    console.error("Error in getQuestions:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const submitAnswers = async (req, res) => {
  try {
    const { userId, answers } = req.body;
    
    // Validate request body
    if (!userId || !answers || !Array.isArray(answers)) {
      return res.status(400).json({ message: "Invalid request payload. Expected userId and an array of answers." });
    }
    
    // Fetch all questions from DB to get the traits and reverse flags safely
    // (We do not rely on the client sending the trait/reverse info)
    const questions = await PersonalityQuestion.find();
    const questionMap = {};
    questions.forEach(q => {
      questionMap[q._id.toString()] = { trait: q.trait, reverse: q.reverse };
    });
    
    // Initialize scores and counts for each trait
    const traitScores = {
      openness: 0,
      conscientiousness: 0,
      extraversion: 0,
      agreeableness: 0,
      neuroticism: 0
    };
    
    const traitCounts = {
      openness: 0,
      conscientiousness: 0,
      extraversion: 0,
      agreeableness: 0,
      neuroticism: 0
    };
    
    // Iterate over user's answers
    for (const ans of answers) {
      const q = questionMap[ans.questionId];
      if (!q) continue; // Skip unknown questionIds
      
      let score = ans.value;
      
      // If the question has `reverse: true`, calculate score = 6 - value
      if (q.reverse) {
        score = 6 - score;
      }
      
      // Group answers by trait
      traitScores[q.trait] += score;
      traitCounts[q.trait] += 1;
    }
    
    // Convert each trait score to a percentage
    const results = {};
    for (const trait in traitScores) {
      const maxPossibleScore = traitCounts[trait] * 5; // since max value is 5
      
      if (maxPossibleScore > 0) {
        // Percentage = (obtainedScore / maxPossibleScore) * 100
        results[trait] = Math.round((traitScores[trait] / maxPossibleScore) * 100);
      } else {
        results[trait] = 0;
      }
    }
    
    // Save the result in MongoDB
    const personalityResult = new PersonalityResult({
      userId,
      openness: results.openness,
      conscientiousness: results.conscientiousness,
      extraversion: results.extraversion,
      agreeableness: results.agreeableness,
      neuroticism: results.neuroticism
    });
    
    await personalityResult.save();
    
    // Return final result
    res.status(200).json(results);
  } catch (error) {
    console.error("Error in submitAnswers:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getResult = async (req, res) => {
  try {
    const userId = req.query.userId || req.body.userId;
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }
    
    // Find the most recent result
    const result = await PersonalityResult.findOne({ userId }).sort({ createdAt: -1 });
    
    if (!result) {
      return res.status(404).json({ message: "No personality result found for this user." });
    }
    
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching personality result:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Admin Controllers
export const getAllQuestionsAdmin = async (req, res) => {
  try {
    const questions = await PersonalityQuestion.find();
    res.status(200).json(questions);
  } catch (error) {
    console.error("Error in getAllQuestionsAdmin:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const addQuestion = async (req, res) => {
  try {
    const newQuestion = new PersonalityQuestion(req.body);
    await newQuestion.save();
    res.status(201).json(newQuestion);
  } catch (error) {
    console.error("Error in addQuestion:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedQuestion = await PersonalityQuestion.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(updatedQuestion);
  } catch (error) {
    console.error("Error in updateQuestion:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    await PersonalityQuestion.findByIdAndDelete(id);
    res.status(200).json({ message: "Question deleted successfully" });
  } catch (error) {
    console.error("Error in deleteQuestion:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
