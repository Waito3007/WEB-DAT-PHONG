const express = require('express');
const mongoose = require('mongoose');
const Favorite = require('../../models/Favorite');
const Hotel = require('../../models/Hotel');  // Model Hotel
const auth = require('../../middleware/auth'); // Middleware xác thực
const router = express.Router();

// Thêm khách sạn vào danh sách yêu thích
router.post('/', auth, async (req, res) => {
  const { hotelId } = req.body;
  const userId = req.userId; // Lấy userId từ middleware

  try {
    // Kiểm tra nếu khách sạn đã được yêu thích
    const exists = await Favorite.exists({ userId, hotelId });
    if (exists) return res.status(400).json({ message: 'Khách sạn này đã được yêu thích' });

    // Tạo yêu thích mới
    const favorite = new Favorite({ userId, hotelId });
    await favorite.save();
    res.status(201).json({ message: 'Thêm vào danh sách yêu thích thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
});

// Kiểm tra trạng thái yêu thích của một khách sạn
router.get('/:hotelId', auth, async (req, res) => {
  const { hotelId } = req.params;
  const userId = req.userId; // Lấy userId từ middleware

  try {
    // Kiểm tra nếu yêu thích tồn tại trong cơ sở dữ liệu
    const favorite = await Favorite.findOne({ userId, hotelId });

    // Nếu không tìm thấy yêu thích, mặc định là chưa yêu thích (false)
    const isFavorite = favorite ? true : false;

    res.status(200).json({ isFavorite });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
});

// Hủy yêu thích khách sạn
router.delete('/:hotelId', auth, async (req, res) => {
  const { hotelId } = req.params;
  const userId = req.userId; // Lấy userId từ middleware

  try {
    await Favorite.deleteOne({ userId, hotelId });
    res.status(200).json({ message: 'Hủy yêu thích thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
});

module.exports = router;