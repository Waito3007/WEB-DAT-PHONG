const express = require('express');
const router = express.Router();
const Room = require('../../models/Room');
const Hotel = require('../../models/Hotel');
const auth = require('../../middleware/auth'); // Middleware xác thực
const upload = require('../../middleware/upload'); // Middleware upload ảnh (Cloudinary)

// Route thêm phòng
router.post('/:hotelId/add-room', auth, upload.array('imageroom', 5), async (req, res) => {
  const { hotelId } = req.params;
  const { type, price, availability } = req.body;

  try {
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ msg: 'Khách sạn không tồn tại' });
    }

    const imageRoomUrls = req.files.map(file => file.path); // Lấy URL ảnh từ Cloudinary

    const newRoom = new Room({
      hotel: hotelId,
      type,
      price,
      availability,
      imageroom: imageRoomUrls,
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
  try {
    const roomId = req.params.roomId;
    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({ msg: 'Không tìm thấy phòng' });
    }
    res.json(room);
  } catch (error) {
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

    // Lấy URL ảnh mới
    const imageRoomUrls = req.files.map(file => file.path);

    // Cập nhật thông tin phòng
    room.type = type || room.type;
    room.price = price || room.price;
    room.availability = availability !== undefined ? availability : room.availability;

    // Gộp ảnh cũ và ảnh mới
    room.imageroom = [...room.imageroom, ...imageRoomUrls];

    // Xóa ảnh đã được đánh dấu
    if (removedImages && removedImages.length > 0) {
      room.imageroom = room.imageroom.filter(image => !removedImages.includes(image));
// Xử lý xóa ảnh khỏi Cloudinary
for (const imageUrl of imagesToRemove) {
  const publicId = imageUrl.split('/').pop().split('.')[0]; // Lấy publicId của ảnh từ URL
  await cloudinary.uploader.destroy(`hotels/${publicId}`, (error, result) => {
    if (error) {
      console.error('Lỗi khi xóa ảnh khỏi Cloudinary:', error);
    } else {
      console.log('Xóa ảnh khỏi Cloudinary thành công:', result);
    }
  });
}

// Xóa ảnh đã đánh dấu khỏi mảng imageroom
room.imageroom = room.imageroom.filter(image => !removedImages.includes(image));    }

    await room.save();
    res.status(200).json({ msg: 'Phòng đã được cập nhật thành công', room });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Lỗi server' });
  }
});


// Xóa phòng
router.delete('/:roomId', auth, async (req, res) => {
  try {
    await Room.findByIdAndDelete(req.params.roomId);
    res.json({ message: 'Phòng đã được xóa' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa phòng' });
  }
});


// Route xóa hình ảnh
router.put('/:roomId/remove-image', async (req, res) => {
  const { roomId } = req.params;
  const { imageUrl } = req.body;

  try {
      // Cập nhật phòng bằng cách xóa URL hình ảnh khỏi mảng imageroom
      const updatedRoom = await Room.findByIdAndUpdate(
          roomId,
          { $pull: { imageroom: imageUrl } },
          { new: true }
      );

      if (!updatedRoom) {
          return res.status(404).json({ message: 'Không tìm thấy phòng' });
      }

      res.json(updatedRoom);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Đã xảy ra lỗi' });
  }
});

module.exports = router;
