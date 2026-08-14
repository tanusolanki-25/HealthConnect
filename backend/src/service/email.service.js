import nodemailer from "nodemailer";
import { ApiError } from "../utils/ApiError.js";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, 
  auth: {
    type: "OAuth2",
    user: process.env.GOOGLE_USER,
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
  },
  connectionTimeout: 20000, // 20 seconds
  greetingTimeout: 20000,
  socketTimeout: 20000,
});

transporter.verify((error, success) => {
  if (error) {
    console.error("GMAIL VERIFY ERROR:", error);
  } else {
    console.log("Email server is ready to send message");
  }
});

export const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"HealthConnect" <${process.env.GOOGLE_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log("Message sent:", info.messageId);
  } catch (error) {
    console.error("EMAIL SEND ERROR:", error);
    console.error("ERROR MESSAGE:", error.message);
    console.error("ERROR CODE:", error.code);

    throw new ApiError(500, "Unable to send verification email");
  }
};