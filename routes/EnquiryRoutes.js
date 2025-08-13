import express from "express";
import Contact from "../models/Enquiry.js";
import transporter from "../configs/mailer.js";

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const { Name,  phone, course , message } = req.body;

    // Validation
    if (!Name ||  !phone || !course || !message) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    // Save to DB
    let savedContact;
    try {
      const newContact = new Contact({ Name, phone, course, message });
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
          <p><b>First Name:</b> ${Name}</p>
          <p><b>Phone:</b> ${phone}</p>
          <p><b>Course:</b> ${course}</p>
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
