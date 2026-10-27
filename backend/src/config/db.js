
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 10000,
  autoSelectFamily: false,
  });

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);

    for (const [host, server] of error.reason?.servers ?? []) {
      console.error(`Server: ${host}`);
      console.error("Cause:", server.error?.message ?? "No detailed cause");
    }

    throw error;
  }
};

module.exports = connectDB;
