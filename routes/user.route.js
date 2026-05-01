import express from "express"
import { signup, login, forgotPassword, resetPassword, checkAuth, logout } from "../controllers/auth.controller.js"


const authRoute = express.Router()

authRoute.post("/register", signup) // I will map /register to signup since frontend might use it
authRoute.post("/login", login)
authRoute.post("/forgot-password", forgotPassword)
authRoute.post("/reset-password/:token", resetPassword)
authRoute.get("/check", checkAuth)
authRoute.post("/logout", logout)

export default authRoute