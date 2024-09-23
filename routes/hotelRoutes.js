const express = require('express');
const router = express.Router();
const Hotel = require('../models/Hotel');

// Route thêm khách sạn
router.post('/add', async (req, res) => {
  try {
    const { name, location, description, manager, rooms } = req.body;
    
    // Tạo một khách sạn mới
    const newHotel = new Hotel({
      name,
      location,
      description,
      manager,
      rooms
    });

    // Lưu vào cơ sở dữ liệu
    const savedHotel = await newHotel.save();
    res.status(201).json(savedHotel);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi thêm khách sạn', error });
  }
});

module.exports = router;