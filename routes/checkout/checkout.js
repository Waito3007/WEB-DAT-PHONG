// routes/checkout/checkout.js
const express = require('express');
const router = express.Router();
const Room = require('../../models/Room'); // Mô hình phòng trong database

// API để lấy chi tiết phòng dựa trên roomId
router.get('/:roomId', async (req, res) => {
  try {
    const room = await Room.findById(req.params.roomId); // Lấy thông tin phòng từ MongoDB
    if (!room) {
      return res.status(404).json({ message: 'Phòng không tồn tại' });
    }
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: 'Có lỗi xảy ra khi lấy thông tin phòng' });
  }
});

module.exports = router;
