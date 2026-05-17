import mongoose from "mongoose";
import dotenv from "dotenv";
import CognitiveQuestion from "./models/CognitiveQuestion.js";

dotenv.config();

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

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("MongoDB Connected");

    await CognitiveQuestion.deleteMany();
    await CognitiveQuestion.insertMany(questions);

    console.log("Cognitive questions seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding Cognitive questions:", error);
    process.exit(1);
  }
};

seedDB();
