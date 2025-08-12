import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("✅ Database Connected");
    });
    await mongoose.connect(`${process.env.MONGODB_URI}/lms`);
  } catch (error) {
    console.error("❌ Database connection error:", error);
    process.exit(1); // stop app if DB fails
  }
};

export default connectDB;
