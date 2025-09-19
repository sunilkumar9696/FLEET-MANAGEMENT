// src/db/connection.js
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Add connection options for better stability
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Better way to get the connection host
    console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
    
    // Additional connection info
    console.log(`📊 Database: ${mongoose.connection.name}`);
    console.log(`🔗 Connection state: ${mongoose.connection.readyState}`);
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

export default connectDB;