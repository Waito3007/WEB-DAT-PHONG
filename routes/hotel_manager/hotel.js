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

// Route để lấy thông tin chi tiết của một khách sạn
router.get('/hotels/:hotelId', auth, async (req, res) => {
  const { hotelId } = req.params;

  // Kiểm tra xem ID có phải là một ObjectId hợp lệ không
  if (!mongoose.Types.ObjectId.isValid(hotelId)) {
      return res.status(400).json({ message: 'ID khách sạn không hợp lệ' });
  }

  try {
      const hotel = await Hotel.findById(hotelId);
      if (!hotel) {
          return res.status(404).json({ message: 'Khách sạn không tồn tại' });
      }
      res.json(hotel);
  } catch (error) {
      console.error('Error fetching hotel details:', error);
      res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy thông tin khách sạn' });
  }
});


module.exports = router;