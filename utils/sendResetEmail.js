import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

/**
 * Send password reset email
 * @param {string} to - User's email
 * @param {string} resetUrl - The reset URL containing the token
 */
export const sendResetEmail = async (to, resetUrl) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT) || 2525,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      debug: true,
      logger: true
    });

    const mailOptions = {
      from: 'no-reply@rahnuma.com',
      to,
      subject: "Rahnuma Password Reset",
      text: `You have requested to reset your password.\n\nPlease click on the following link, or paste this into your browser to complete the process:\n\n${resetUrl}\n\nThis link will expire in 30 minutes.\n\nIf you did not request this, please ignore this email and your password will remain unchanged.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Rahnuma Password Reset</h2>
          <p>You have requested to reset your password.</p>
          <p>Please click the button below to choose a new password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #ec4899; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Reset Password</a>
          </div>
          <p>Or paste this link into your browser:</p>
          <p><a href="${resetUrl}">${resetUrl}</a></p>
          <p style="color: #666; font-size: 14px;"><strong>Note:</strong> This link will expire in 30 minutes.</p>
          <p style="color: #999; font-size: 12px; margin-top: 40px;">If you did not request this password reset, please ignore this email.</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("=== EMAIL SENT SUCCESSFULLY ===", info.messageId);
    return info;
  } catch (error) {
    console.error("=== MAILTRAP SMTP ERROR ===", error);
    throw error;
  }
};
