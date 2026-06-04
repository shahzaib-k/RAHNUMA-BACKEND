import express from "express"
import { connectDB } from "./config/db.js"
import authRoute from "./routes/user.route.js"
import resumeRoute from "./routes/resume.route.js"
import cognitiveRoute from "./routes/cognitive.route.js"
import personalityRoutes from "./routes/personalityRoutes.js"
import recommendationRoutes from "./routes/recommendationRoutes.js"
import atsRoutes from "./routes/ats.route.js"
import dashboardRoute from "./routes/dashboard.route.js"
import cors from "cors"

const app = express()

// Connect to MongoDB
app.use(cors()); // allows all origins (quick fix)


app.use(express.json());

app.use("/auth", authRoute)
app.use("/api", resumeRoute )
app.use("/api/cognitive-test", cognitiveRoute )
app.use("/api/personality", personalityRoutes )
app.use("/api/recommendations", recommendationRoutes )
app.use("/api/ats", atsRoutes )
app.use("/api/dashboard", dashboardRoute )



import { sendResetEmail } from "./utils/sendResetEmail.js";

app.get("/mail-test", async (req, res) => {
  try {
    const info = await sendResetEmail("test@example.com", "http://test-url");
    res.json({ success: true, message: "Mailtrap test successful", infoId: info.messageId });
  } catch (err) {
    res.status(500).json({ success: false, message: "Mailtrap test failed", error: err.message });
  }
});

connectDB().then(() => {
  app.listen(5000, () => {
  console.log("Server is running on port 5000")
})
}).catch((error) => {
    console.log(error);
})