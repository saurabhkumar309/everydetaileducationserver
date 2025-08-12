import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,  // must match Gmail account
    pass: process.env.EMAIL_PASS   // App Password if 2FA is on
  }
});

// Optional: verify transporter connection at startup
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Mail server connection failed:", error);
  } else {
    console.log("✅ Mail server ready to send emails");
  }
});

export default transporter;
