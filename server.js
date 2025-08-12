import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from "./configs/mongodb.js";
import contactRoutes from "./routes/contactRoutes.js";

const app = express();

// Connect DB
await connectDB();

// Allowed origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://tranquil-sunburst-bd42dd.netlify.app",
 " https://everydetaileducation.vercel.app"];

// CORS middleware
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json());

// Routes
app.get("/", (req, res) => res.send("API Working"));
app.use("/api/contact", contactRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error("🔥 Unhandled error:", err);
  res.status(500).json({ success: false, message: err.message || "Internal Server Error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
