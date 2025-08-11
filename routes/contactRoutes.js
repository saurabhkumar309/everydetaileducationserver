import express from "express";
import Contact from "../models/Contact.js";
import transporter from "../configs/mailer.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { firstName, lastName, email, phone, message } = req.body;

    // Save to MongoDB
    const newContact = new Contact({ firstName, lastName, email, phone, message });
    await newContact.save();
    
    // Send email
    await transporter.sendMail({
      from: `"Contact Form" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: "New Contact Form Submission",
      html: `
        <h2>New Contact Submission</h2>
        <p><b>First Name:</b> ${firstName}</p>
        <p><b>Last Name:</b> ${lastName}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Message:</b> ${message}</p>
      `
    });

    res.json({ success: true, message: "Your message has been sent successfully!" });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ success: false, message: "Something went wrong. Please try again." });
  }
});

export default router;
