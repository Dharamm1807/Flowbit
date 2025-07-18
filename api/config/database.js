//CONNECTING DATA BASE FUNCTION
// This file is responsible for connecting to the MongoDB database using Mongoose.
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ MongoDB connected');
    console.log(`   URI: ${mongoURI}`);
    
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = { connectDB };