const mongoose = require('mongoose');

// Chuỗi kết nối MongoDB Atlas
const mongoURI = 'mongodb+srv://sangvu:sangvu3007HSGamer@bookingweb.pdloq.mongodb.net/?retryWrites=true&w=majority&appName=BookingWeb';
// Hàm để kết nối đến MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1); // Dừng ứng dụng nếu không kết nối được
  }
};
module.exports = connectDB;
