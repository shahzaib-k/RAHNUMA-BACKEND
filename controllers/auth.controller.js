import User from "../models/User.js";
import PasswordResetToken from "../models/PasswordResetToken.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { sendResetEmail } from "../utils/sendResetEmail.js";

// Basic Signup
export const signup = async (req, res) => {
  try {
    const { fullName, email, education, targetRole, password } = req.body;

    // Validate required fields
    if (!fullName || !email || !education || !targetRole || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      education,
      targetRole,
      password: hashedPassword,
    });

    await newUser.save();

    // Generate token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET || 'secret123', { expiresIn: '24h' });

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        education: newUser.education,
        targetRole: newUser.targetRole,
      }
    });
  } catch (error) {
    console.error("Error in signup:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Basic Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret123', { expiresIn: '24h' });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        education: user.education,
        targetRole: user.targetRole,
      }
    });

  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Forgot Password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    
    // As per instruction: "Always return generic success message"
    // Proceed only if user exists
    if (user) {
      // Generate standard reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
      const resetUrl = `${clientUrl}/reset-password/${resetToken}`;

      // Set expiry to 30 minutes from now
      const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

      // Save token to DB
      await PasswordResetToken.create({
        userId: user._id.toString(),
        token: resetToken,
        expiresAt
      });
      
      // Send the email with the reset link
      await sendResetEmail(user.email, resetUrl);
    }

    res.status(200).json({ message: "If an account matches that email, a password reset link has been sent." });

  } catch (error) {
    console.error("Error in forgotPassword:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Reset Password
export const resetPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const { token } = req.params;

    if (!newPassword) {
      return res.status(400).json({ message: "Please provide a new password" });
    }

    // Find token in PasswordResetToken collection that is not expired
    const resetRecord = await PasswordResetToken.findOne({
      token,
      expiresAt: { $gt: new Date() },
    });

    if (!resetRecord) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    const user = await User.findById(resetRecord.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    // Delete used token
    await PasswordResetToken.deleteOne({ _id: resetRecord._id });

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Check Token validity
export const checkAuth = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1] || req.cookies?.token;
    if (!token) {
      return res.status(401).json({ message: "No token provided, authorization denied" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
    const user = await User.findById(decoded.id).select("-password -resetPasswordToken -resetPasswordExpire");

    if (!user) {
      return res.status(401).json({ message: "Token is valid, but user not found" });
    }

    res.status(200).json({ valid: true, user });
  } catch (error) {
    console.error("Error in checkAuth:", error);
    res.status(401).json({ valid: false, message: "Token is invalid or expired" });
  }
};

// Logout
export const logout = async (req, res) => {
  try {
    res.clearCookie('token');
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error in logout:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

