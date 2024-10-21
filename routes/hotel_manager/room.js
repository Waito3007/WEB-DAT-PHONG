const express = require('express');
const router = express.Router();
const Room = require('../../models/Room');
const Hotel = require('../../models/Hotel');
const auth = require('../../middleware/auth'); // Middleware xác thực
const upload = require('../../middleware/upload'); // Middleware upload ảnh (Cloudinary)
const cloudinary = require('cloudinary').v2;

// Hàm để lấy publicId từ URL của Cloudinary
const getPublicIdFromUrl = (url) => {
  const matches = url.match(/\/v\d+\/(.+)\.(jpg|jpeg|png|gif|webp)/);
  return matches ? matches[1] : null;
};

// Route thêm phòng
router.post('/:hotelId/add-room', auth, upload.array('imageroom', 5), async (req, res) => {
  const { hotelId } = req.params;
  const { type, price, availability, remainingRooms } = req.body;

  try {
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ msg: 'Khách sạn không tồn tại' });
    }

    const imageRoomUrls = req.files ? req.files.map(file => file.path) : [];

    const newRoom = new Room({
      hotel: hotelId,
      type,
      price,
      availability,
      imageroom: imageRoomUrls,
      remainingRooms: remainingRooms || 0, // Nếu không có, mặc định là 0
    });

    await newRoom.save();
    hotel.rooms.push(newRoom._id);
    await hotel.save();

    res.status(201).json({ msg: 'Phòng đã được thêm thành công', room: newRoom });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Lỗi server' });
  }
});

// Route để lấy danh sách phòng cho một khách sạn
router.get('/:hotelId/rooms', auth, async (req, res) => {
  const { hotelId } = req.params;

  try {
    const rooms = await Room.find({ hotel: hotelId });
    if (!rooms.length) {
      return res.status(404).json({ msg: 'Không tìm thấy phòng nào' });
    }

    res.status(200).json(rooms);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Lỗi server' });
  }
});

// Lấy chi tiết phòng theo roomId
router.get('/:roomId', auth, async (req, res) => {
  const { roomId } = req.params; // Lấy roomId từ params

  try {
    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({ msg: 'Không tìm thấy phòng' });
    }
    res.json(room);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Lỗi server', error });
  }
});

// Route cập nhật phòng
router.put('/:roomId', auth, upload.array('imageroom', 5), async (req, res) => {
  const { roomId } = req.params;
  const { type, price, availability, removedImages } = req.body;

  try {
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ msg: 'Phòng không tồn tại' });
    }

    // Kiểm tra nếu có ảnh mới được upload
    const imageRoomUrls = req.files ? req.files.map(file => file.path) : [];

    // Cập nhật thông tin phòng
    room.type = type || room.type;
    room.price = price || room.price;
    room.availability = availability !== undefined ? availability : room.availability;

    // Gộp ảnh cũ và ảnh mới
    room.imageroom = [...room.imageroom, ...imageRoomUrls];

    // Xóa ảnh đã được đánh dấu
    if (Array.isArray(removedImages) && removedImages.length > 0) {
      const publicIdsToRemove = removedImages.map(url => getPublicIdFromUrl(url)).filter(id => id);

      // Xử lý xóa ảnh khỏi Cloudinary
      for (const publicId of publicIdsToRemove) {
        try {
          const result = await cloudinary.uploader.destroy(publicId);
          console.log('Xóa ảnh khỏi Cloudinary thành công:', result);
        } catch (error) {
          console.error('Lỗi khi xóa ảnh khỏi Cloudinary:', error);
        }
      }

      // Cập nhật imageroom sau khi xóa
      room.imageroom = room.imageroom.filter(image => !removedImages.includes(image));
    }

    await room.save();
    res.status(200).json({ msg: 'Phòng đã được cập nhật thành công', room });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Lỗi server' });
  }
});

// Xóa phòng
router.delete('/:roomId', auth, async (req, res) => {
  const roomId = req.params.roomId;
  try {
    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({ message: 'Không tìm thấy phòng' });
    }

    // Xóa ảnh khỏi Cloudinary trước khi xóa phòng
    const publicIds = room.imageroom.map(url => getPublicIdFromUrl(url)).filter(id => id);

    for (const publicId of publicIds) {
      try {
        await cloudinary.uploader.destroy(publicId);
      } catch (error) {
        console.error('Lỗi khi xóa ảnh khỏi Cloudinary:', error);
      }
    }

    // Gọi pre hook để xóa tham chiếu phòng trong mô hình Hotel
    await Room.findByIdAndDelete(roomId);

    res.json({ message: 'Phòng đã được xóa' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Lỗi khi xóa phòng', error: error.message });
  }
});

// Route xóa hình ảnh
router.put('/:roomId/remove-image', auth, async (req, res) => {
  const { roomId } = req.params;
  const { imageUrl } = req.body;

  try {
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Không tìm thấy phòng' });
    }

    // Xóa ảnh khỏi Cloudinary
    const publicId = getPublicIdFromUrl(imageUrl);
    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
    }

    const updatedRoom = await Room.findByIdAndUpdate(
      roomId,
      { $pull: { imageroom: imageUrl } },
      { new: true }
    );

    res.json(updatedRoom);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Đã xảy ra lỗi' });
  }
});

module.exports = router;
