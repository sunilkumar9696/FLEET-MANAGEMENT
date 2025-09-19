import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // Correct way to log in Mongoose 7/8
    console.log(
      `📦 MongoDB connected: ${conn.connection.host} / ${conn.connection.db.databaseName}`
    );
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
