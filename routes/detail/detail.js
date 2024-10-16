// routes/detail/order.js
const express = require('express');
const router = express.Router();
const Hotel = require('../../models/Hotel');
const Rate = require('../../models/Rate');
const Room = require('../../models/Room'); // Import mô hình Room

// GET hotel details by ID
router.get('/:hotelId', async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.hotelId);
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    const ratings = await Rate.find({ hotel: hotel._id });
    const averageRating = ratings.length > 0 
      ? ratings.reduce((acc, rate) => acc + rate.rating, 0) / ratings.length 
      : 0;

    // Tìm giá phòng thấp nhất của khách sạn
    const rooms = await Room.find({ hotel: hotel._id });
    const lowestPrice = rooms.length > 0 
      ? Math.min(...rooms.map(room => room.price)) 
      : 0;
    res.json({
      hotel,
      averageRating,
      totalRatings: ratings.length,
      lowestPrice // Giá phòng thấp nhất
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Lấy thông tin hình ảnh của khách sạn theo ID
router.get('/:hotelId/image', async (req, res) => {
  const { hotelId } = req.params;

  if (!hotelId) {
    return res.status(400).json({ message: 'Khách sạn ID không hợp lệ.' });
  }

  try {
    const hotel = await Hotel.findById(hotelId).select('imagehotel');
    if (!hotel) {
      return res.status(404).json({ message: 'Khách sạn không tìm thấy.' });
    }

    const images = hotel.imagehotel.slice(0, 5); // Lấy tối đa 5 ảnh
    if (images.length === 0) {
      return res.status(204).json({ message: 'Khách sạn không có ảnh nào.' }); // 204 No Content
    }

    res.json(images);
  } catch (error) {
    console.error('Error fetching hotel images:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra khi lấy thông tin.', error: error.message });
  }
});

module.exports = router;
