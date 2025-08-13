import mongoose from "mongoose";

const formSubmissionSchema = new mongoose.Schema({
  type: { type: String, enum: ["contact", "enquiry"], required: true }, // either form
  name: { type: String, trim: true }, // from enquiry
  firstName: { type: String, trim: true }, // from contact
  lastName: { type: String, trim: true }, // from contact
  phone: { type: String, required: true, trim: true },
  email: { type: String, trim: true }, // optional in enquiry
  course: { type: String, trim: true }, // from enquiry
  message: { type: String, trim: true },
  date: { type: Date, default: Date.now }
});

export default mongoose.model("FormSubmission", formSubmissionSchema);
