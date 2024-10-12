const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
  type: { type: String, required: true }, // ví dụ: 'Deluxe', 'Standard'
  price: { type: Number, required: true },
  availability: { type: Boolean, default: true },
  imageroom: [{ type: String }], // Mảng các URL ảnh
});

// Middleware xóa tham chiếu phòng trong model Hotel khi xóa phòng
roomSchema.pre('remove', async function (next) {
  try {
    // Tìm khách sạn mà phòng này thuộc về
    const hotel = await mongoose.model('Hotel').findById(this.hotel);
    
    if (hotel) {
      // Loại bỏ ID của phòng khỏi danh sách rooms của khách sạn
      hotel.rooms = hotel.rooms.filter(roomId => roomId.toString() !== this._id.toString());
      
      // Lưu lại tài liệu khách sạn sau khi đã cập nhật danh sách rooms
      await hotel.save();
    }
    
  } catch (error) {
    next(error); // Gọi hàm next với lỗi nếu có
  }
});

module.exports = mongoose.model('Room', roomSchema);
