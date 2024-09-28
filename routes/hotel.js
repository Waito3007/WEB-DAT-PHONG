// routes/hotel.js
const express = require('express');
const router = express.Router();
const Hotel = require('../models/Hotel');
const auth = require('../middleware/auth'); // Middleware xác thực

// Route thêm khách sạn
router.post('/addhotel', auth, async (req, res) => {
  const { name, location, description, rooms, imagehotel } = req.body;

  try {
    // Lấy ID của người quản lý từ token
    const managerId = req.user.userId;

    // Tạo mới khách sạn
    const newHotel = new Hotel({
      name,
      location,
      description,
      manager: managerId, // ID của người quản lý
      rooms, // Danh sách phòng nếu có
      imagehotel // Danh sách ảnh khách sạn
    });

    // Lưu khách sạn vào cơ sở dữ liệu
    await newHotel.save();

    res.status(201).json({ msg: 'Khách sạn đã được thêm thành công', hotel: newHotel });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Lỗi server' });
  }
});

module.exports = router;
