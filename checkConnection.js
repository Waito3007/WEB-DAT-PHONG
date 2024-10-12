const mongoose = require('mongoose');
const Rate = require('./models/Rate'); // Đường dẫn tới model Rate của bạn

// Giả sử bạn có sẵn ObjectId của hotel và user
const hotelId = '66fed7b0120035018573c219'; // Thay bằng ObjectId thật của hotel
const userId = '66edafedab0ffb31c524442f'; // Thay bằng ObjectId thật của user

// Tạo một document mới cho Rate
const createRate = async () => {
  try {
    // Tạo mới đánh giá
    const newRate = new Rate({
      hotel: hotelId,             // ObjectId của hotel
      user: userId,               // ObjectId của user
      rating: 8,                  // Điểm đánh giá (ví dụ: 8)
      comment: 'Khách sạn tuyệt vời, dịch vụ rất tốt!', // Bình luận (nếu có)
    });

    // Lưu document mới vào database
    const savedRate = await newRate.save();
    
    console.log('Đánh giá mới được tạo:', savedRate);
  } catch (error) {
    console.error('Lỗi khi tạo đánh giá:', error);
  }
};

// Kết nối MongoDB và thực hiện tạo đánh giá
mongoose.connect('mongodb+srv://sangvu:sangvu3007HSGamer@bookingweb.pdloq.mongodb.net/?retryWrites=true&w=majority&appName=BookingWeb', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Kết nối thành công đến MongoDB');
    createRate(); // Tạo đánh giá sau khi kết nối thành công
  })
  .catch(err => {
    console.error('Lỗi khi kết nối MongoDB:', err);
  });
