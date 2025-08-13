import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  Name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  course: { type: String, required: true, trim: true },
  message: { type: String, required: true, trim: true },
  date: { type: Date, default: Date.now }
});

const Contact = mongoose.model("Contact", contactSchema);
export default Contact;
