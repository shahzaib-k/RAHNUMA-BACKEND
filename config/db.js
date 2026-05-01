import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URL) {
            console.warn("MONGODB_URL is not defined in environment variables. Database will not connect.");
            return;
        }
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Database connected (via config/db.js)");
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

export { connectDB };
