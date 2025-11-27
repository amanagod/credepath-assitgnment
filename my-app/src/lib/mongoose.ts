import mongoose from "mongoose";

export const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;

  const uri = process.env.MONGODB_URI as string;

  if (!uri) {
    throw new Error(" Missing MONGODB_URI in .env.local");
  }

  return mongoose.connect(uri);
};
