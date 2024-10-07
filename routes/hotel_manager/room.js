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


// Route để lấy danh sách phòng cho một khách sạn
router.get('/:hotelId/rooms', async (req, res) => {
  const { hotelId } = req.params;

  try {
    // Tìm các phòng thuộc về khách sạn có hotelId
    const rooms = await Room.find({ hotel: hotelId });

    if (!rooms) {
      return res.status(404).json({ msg: 'Không tìm thấy phòng nào' });
    }

    res.status(200).json(rooms);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Lỗi server' });
  }
});

// Route để lấy thông tin phòng
router.get('/api/room/:roomId', async (req, res) => {
  const { roomId } = req.params;
  try {
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ msg: 'Không tìm thấy phòng' });
    }
    res.status(200).json(room);
  } catch (error) {
    console.error('Lỗi khi lấy thông tin phòng:', error);
    res.status(500).json({ msg: 'Đã xảy ra lỗi khi lấy thông tin phòng' });
  }
});


// Route để chỉnh sửa thông tin phòng
router.put('/api/room/:roomId', auth, async (req, res) => {
  const { roomId } = req.params;
  const { type, price, availability, imageroom } = req.body;

  try {
    const updatedRoom = await Room.findByIdAndUpdate(
      roomId,
      { type, price, availability, imageroom },
      { new: true }
    );

    if (!updatedRoom) {
      return res.status(404).json({ msg: 'Phòng không tìm thấy' });
    }

    res.status(200).json(updatedRoom);
  } catch (error) {
    console.error('Lỗi khi chỉnh sửa phòng:', error);
    res.status(500).json({ msg: 'Đã xảy ra lỗi khi chỉnh sửa phòng' });
  }
});

module.exports = router;
