import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection;

    db.on("error", (err) => {
      console.error(" MongoDB connection error:", err);
    });
    db.on("disconnected", () => {
      console.log(" MongoDB disconnected.");
    });
  } catch (error) {
    console.error(" Initial DB connection error:", error.message);
    throw error;
  }
};

export default connectDB;
