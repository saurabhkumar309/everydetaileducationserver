import express from "express";
import FormSubmission from "../models/FormSubmission.js";
import transporter from "../configs/mailer.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { type } = req.body;

    if (!type || !["contact", "enquiry"].includes(type)) {
      return res.status(400).json({ success: false, message: "Invalid form type" });
    }

    // Validate required fields based on form type
    if (type === "contact") {
      if (!req.body.firstName || !req.body.lastName || !req.body.email || !req.body.phone || !req.body.message) {
        return res.status(400).json({ success: false, message: "All contact form fields are required." });
      }
    } else if (type === "enquiry") {
      if (!req.body.name || !req.body.phone || !req.body.course) {
        return res.status(400).json({ success: false, message: "All enquiry form fields are required." });
      }
    }

    // Save in DB
    const saved = await FormSubmission.create({ ...req.body });

    // Email subject & HTML based on type
    let emailSubject, emailHtml;
    if (type === "contact") {
      emailSubject = "New Contact Form Submission";
      emailHtml = `
        <h2>New Contact Submission</h2>
        <p><b>First Name:</b> ${req.body.firstName}</p>
        <p><b>Last Name:</b> ${req.body.lastName}</p>
        <p><b>Email:</b> ${req.body.email}</p>
        <p><b>Phone:</b> ${req.body.phone}</p>
        <p><b>Message:</b> ${req.body.message}</p>
      `;
    } else {
      emailSubject = "New Enquiry Form Submission";
      emailHtml = `
        <h2>New Enquiry Submission</h2>
        <p><b>Name:</b> ${req.body.name}</p>
        <p><b>Phone:</b> ${req.body.phone}</p>
        <p><b>Course:</b> ${req.body.course}</p>
        <p><b>Message:</b> ${req.body.message || "N/A"}</p>
      `;
    }

    // Send email
    await transporter.sendMail({
      from: `"Website Form" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: emailSubject,
      html: emailHtml
    });

    res.json({ success: true, message: `${type === "contact" ? "Contact" : "Enquiry"} form submitted successfully!` });

  } catch (err) {
    console.error("❌ Form submission error:", err);
    res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
});

export default router;
