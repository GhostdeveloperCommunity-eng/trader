// db.js
import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return mongoose.connection;
  }

  try {
    const connection = await mongoose.connect(process.env.MONGO_URL, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    return connection;
  } catch (error) {
    throw error;
  }
};

export default connectDB;
