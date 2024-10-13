const mongoose = require('mongoose');
require('dotenv').config(); // Đọc biến môi trường từ file .env

const mongoURI = process.env.MONGO_URI; // Lấy URI từ file .env

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1); // Dừng ứng dụng nếu không kết nối được
  }
};

module.exports = connectDB;

