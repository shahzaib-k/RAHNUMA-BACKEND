const questions = [
  { id: 1, type: "logical", question: "What comes next in the sequence: 2, 4, 8, 16, ?", options: ["18", "20", "32", "24"], answer: "32" },
  { id: 2, type: "verbal", question: "Choose the synonym of 'happy'.", options: ["Sad", "Joyful", "Angry", "Tired"], answer: "Joyful" },
  { id: 3, type: "quantitative", question: "Solve: 5 * (3 + 2)", options: ["15", "25", "20", "30"], answer: "25" },
  { id: 4, type: "logical", question: "If all Bloops are Razzies and all Razzies are Lazzies, are all Bloops Lazzies?", options: ["Yes", "No", "Cannot be determined", "Sometimes"], answer: "Yes" },
  { id: 5, type: "verbal", question: "Which word does not belong?", options: ["Apple", "Orange", "Banana", "Carrot"], answer: "Carrot" },
  { id: 6, type: "quantitative", question: "If a train travels 60 miles in 1.5 hours, what is its average speed in mph?", options: ["40", "45", "50", "60"], answer: "40" },
  { id: 7, type: "logical", question: "Finger is to Hand as Leaf is to...?", options: ["Tree", "Branch", "Twig", "Flower"], answer: "Branch" },
  { id: 8, type: "verbal", question: "What is the antonym of 'Expand'?", options: ["Grow", "Stretch", "Contract", "Magnify"], answer: "Contract" },
  { id: 9, type: "quantitative", question: "What is 15% of 200?", options: ["20", "25", "30", "35"], answer: "30" },
  { id: 10, type: "logical", question: "Odometer is to mileage as compass is to...?", options: ["Speed", "Hiking", "Needle", "Direction"], answer: "Direction" },
  { id: 11, type: "verbal", question: "Select the correctly spelled word.", options: ["Occasion", "Ocasion", "Occassion", "Occasssion"], answer: "Occasion" },
  { id: 12, type: "quantitative", question: "Solve for x: 3x - 7 = 14", options: ["5", "6", "7", "8"], answer: "7" },
  { id: 13, type: "logical", question: "A is the brother of B. B is the brother of C. C is the father of D. How is A related to D?", options: ["Uncle", "Brother", "Father", "Cousin"], answer: "Uncle" },
  { id: 14, type: "verbal", question: "Identify the incorrectly spelled word.", options: ["Embarrass", "Accommodate", "Definately", "Separate"], answer: "Definately" },
  { id: 15, type: "quantitative", question: "If a shirt costs $40 after a 20% discount, what was its original price?", options: ["$45", "$48", "$50", "$60"], answer: "$50" },
  { id: 16, type: "logical", question: "Which sequence comes next: A1, B2, C3, ?", options: ["D3", "E4", "D4", "C4"], answer: "D4" },
  { id: 17, type: "verbal", question: "Fill in the blank: The team played ____ despite the rain.", options: ["good", "well", "fine", "better"], answer: "well" },
  { id: 18, type: "quantitative", question: "How many degrees are in a right angle?", options: ["45", "90", "180", "360"], answer: "90" },
  { id: 19, type: "logical", question: "If you rearrange the letters 'CIFAIPC', you would have the name of a(n):", options: ["City", "Animal", "Ocean", "River"], answer: "Ocean" },
  { id: 20, type: "verbal", question: "Which is a synonym for 'Abundant'?", options: ["Scarce", "Plentiful", "Rare", "Sparse"], answer: "Plentiful" }
];

export const getQuestions = (req, res) => {
  res.status(200).json(questions);
};

export const submitAnswers = async (req, res) => {
  const { userId, answers: userAnswers } = req.body;
  let score = 0;

  if (!userAnswers || !Array.isArray(userAnswers)) {
    return res.status(400).json({ error: "Invalid answers format" });
  }

  const categoryScores = { logical: 0, verbal: 0, quantitative: 0 };
  const categoryTotals = { logical: 0, verbal: 0, quantitative: 0 };

  // Determine total questions per category
  questions.forEach(q => {
    if (categoryTotals[q.type] !== undefined) categoryTotals[q.type]++;
  });

  userAnswers.forEach(ans => {
    const q = questions.find(q => q.id === ans.id);
    if (q && q.answer === ans.answer) {
      score += 1; // 1 point per correct answer
      if (categoryScores[q.type] !== undefined) categoryScores[q.type]++;
    }
  });

  // Convert to percentages mapping dynamically
  const logical = Math.round((categoryScores.logical / categoryTotals.logical) * 100) || 0;
  const verbal = Math.round((categoryScores.verbal / categoryTotals.verbal) * 100) || 0;
  const quantitative = Math.round((categoryScores.quantitative / categoryTotals.quantitative) * 100) || 0;

  try {
    if (userId) {
      // Import inline to avoid circle dependencies or top-level bugs if needed, 
      // but better to just use top-level import. Let's lazily import or assume it's imported.
      // Wait, I need to add the import at the top of the file! 
      // Let me import it dynamically or at the top. I'll just dynamically import it for simplicity 
      // without needing to rewrite the top chunk.
      const { default: CognitiveResult } = await import("../models/CognitiveResult.js");
      const cognitiveResult = new CognitiveResult({
        userId,
        logical,
        verbal,
        quantitative
      });
      await cognitiveResult.save();
    }
  } catch (err) {
    console.error("Failed to save cognitive result:", err);
  }

  res.status(200).json({ score, total: questions.length });
};
