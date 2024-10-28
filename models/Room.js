const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
  type: { 
    type: String, 
    required: true, 
    enum: ['1 phòng 1 người', '1 phòng 2 người', '2 phòng 2 người', '2 phòng 4 người'] // Giới hạn các loại phòng
  },
  price: { type: Number, required: true },
  availability: { type: Boolean, default: true },
  imageroom: [{ type: String }], // Mảng các URL ảnh
  remainingRooms: { type: Number, required: true, default: 0 }, // Số phòng còn trống
});

// Middleware xóa tham chiếu phòng trong model Hotel khi xóa phòng
roomSchema.pre('findOneAndDelete', async function (next) {
  try {
    // Lấy ID phòng từ truy vấn
    const room = await this.model.findOne(this.getFilter());

    // Tìm khách sạn mà phòng này thuộc về
    const hotel = await mongoose.model('Hotel').findById(room.hotel);
    
    if (hotel) {
      // Loại bỏ ID của phòng khỏi danh sách rooms của khách sạn
      hotel.rooms = hotel.rooms.filter(roomId => roomId.toString() !== room._id.toString());
      
      // Lưu lại tài liệu khách sạn sau khi đã cập nhật danh sách rooms
      await hotel.save();
    }
    
    next(); // Tiếp tục đến bước tiếp theo
  } catch (error) {
    next(error); // Gọi hàm next với lỗi nếu có
  }
});

module.exports = mongoose.model('Room', roomSchema);