import express from "express";
import Contact from "../models/Contact.js";
import transporter from "../configs/mailer.js";

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, message } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !phone || !message) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    // Save to DB
    let savedContact;
    try {
      const newContact = new Contact({ firstName, lastName, email, phone, message });
      savedContact = await newContact.save();
      console.log("✅ Contact saved to DB:", savedContact._id);
    } catch (dbErr) {
      console.error("❌ DB save error:", dbErr);
      return res.status(500).json({ success: false, message: "Database error. Try again." });
    }

    // Send email
    try {
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
      console.log("📧 Email sent successfully");
    } catch (mailErr) {
      console.error("❌ Email sending error:", mailErr);
      // We still return success for DB save; warn about email
      return res.status(200).json({
        success: true,
        message: "Message saved, but email notification failed."
      });
    }

    res.status(200).json({ success: true, message: "Your message has been sent successfully!" });

  } catch (err) {
    next(err); // Send to global error handler
  }
});

export default router;
