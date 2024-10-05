const express = require('express');
const router = express.Router();
const Room = require('../../models/Room');
const Hotel = require('../../models/Hotel');
const auth = require('../../middleware/auth'); // Middleware xác thực
const upload = require('../../middleware/upload'); // Middleware upload ảnh (Cloudinary)

router.post('/:hotelId/add-room', auth, upload.array('imageroom', 5), async (req, res) => {
  const { hotelId } = req.params;
  const { type, price, availability } = req.body;

  try {
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ msg: 'Khách sạn không tồn tại' });
    }

    // Lấy URL ảnh từ Cloudinary sau khi upload thành công
    const imageRoomUrls = req.files.map(file => file.path); // file.path chứa URL từ Cloudinary

    // Tạo phòng mới
    const newRoom = new Room({
      hotel: hotelId,
      type,
      price,
      availability,
      imageroom: imageRoomUrls, // Lưu URL ảnh vào trường imageroom
    });

    await newRoom.save();

    // Thêm phòng vào khách sạn
    hotel.rooms.push(newRoom._id);
    await hotel.save();

    res.status(201).json({ msg: 'Phòng đã được thêm thành công', room: newRoom });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Lỗi server' });
  }
});

module.exports = router;
