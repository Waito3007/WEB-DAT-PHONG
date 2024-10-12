const mongoose = require('mongoose');

const rateSchema = new mongoose.Schema({
  hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true }, // Khách sạn được đánh giá
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Người dùng đánh giá
  rating: { type: Number, min: 1, max: 10, required: true }, // Điểm đánh giá (từ 1 đến 10)
  comment: { type: String }, // Bình luận của người dùng (nếu có)
  date: { type: Date, default: Date.now }, // Ngày đánh giá
  lastModified: { type: Date, default: Date.now }, // Ngày chỉnh sửa gần nhất
});

// Middleware để cập nhật lastModified khi đánh giá bị chỉnh sửa
rateSchema.pre('save', function (next) {
  if (this.isModified('rating') || this.isModified('comment')) {
    this.lastModified = Date.now();
  }
  next();
});

module.exports = mongoose.model('Rate', rateSchema);
