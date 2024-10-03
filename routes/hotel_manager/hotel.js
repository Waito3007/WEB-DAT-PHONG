// routes/hotel_mangager/hotel.js
const express = require('express');
const router = express.Router();
const Hotel = require('../../models/Hotel');
const auth = require('../../middleware/auth'); // Middleware xác thực
const upload = require('../../middleware/upload'); // Middleware upload ảnh
// Route thêm khách sạn
router.post('/addhotel', auth, upload.array('imagehotel', 5), async (req, res) => {
  const { name, location, description, rooms } = req.body;

  try {
    const managerId = req.user.userId;

    // Lấy link ảnh từ Cloudinary sau khi upload
    const imageUrls = req.files.map(file => file.path);

    const newHotel = new Hotel({
      name,
      location,
      description,
      manager: managerId,
      rooms,
      imagehotel: imageUrls, // Lưu link ảnh Cloudinary
    });

    await newHotel.save();

    res.status(201).json({ msg: 'Khách sạn đã được thêm thành công', hotel: newHotel });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Lỗi server' });
  }
});

// Route lấy danh sách khách sạn của người dùng hiện tại
router.get('/myhotels', auth, async (req, res) => {
  try {
    const managerId = req.user.userId; // Lấy ID người dùng từ middleware auth

    // Tìm các khách sạn mà người dùng là quản lý và lấy thêm thông tin từ 'User'
    const hotels = await Hotel.find({ manager: managerId })
      .populate('manager', 'name email'); // Tham chiếu thông tin từ model 'User'

    res.status(200).json(hotels);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Lỗi server' });
  }
});


const mongoose = require('mongoose');

// Route lấy thông tin khách sạn cụ thể
router.get('/:hotelId', auth, async (req, res) => {
  try {
    const hotelId = req.params.hotelId;
    const hotel = await Hotel.findById(hotelId);

    if (!hotel) {
      return res.status(404).json({ msg: 'Không tìm thấy khách sạn' });
    }

    res.json(hotel);
  } catch (error) {
    res.status(500).json({ msg: 'Lỗi server', error });
  }
});


module.exports = router;