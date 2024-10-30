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

// Lấy thông tin hình ảnh của khách sạn và hình ảnh các phòng theo ID
router.get('/:hotelId/image', async (req, res) => {
  const { hotelId } = req.params;

  if (!hotelId) {
    return res.status(400).json({ message: 'Khách sạn ID không hợp lệ.' });
  }

  try {
    // Tìm khách sạn
    const hotel = await Hotel.findById(hotelId).select('imagehotel');
    if (!hotel) {
      return res.status(404).json({ message: 'Khách sạn không tìm thấy.' });
    }

    // Tìm tất cả các phòng của khách sạn
    const rooms = await Room.find({ hotel: hotelId }).select('imageroom');
    
    // Tạo mảng chứa tất cả hình ảnh
    const images = {
      hotelImages: hotel.imagehotel.slice(0, 5), // Lấy tối đa 5 hình ảnh khách sạn
      roomImages: rooms.flatMap(room => room.imageroom), // Lấy tất cả hình ảnh phòng
    };

    // Kiểm tra nếu không có hình ảnh nào
    if (images.hotelImages.length === 0 && images.roomImages.length === 0) {
      return res.status(204).json({ message: 'Khách sạn không có ảnh nào.' }); // 204 No Content
    }

    res.json(images); // Trả về hình ảnh khách sạn và phòng
  } catch (error) {
    console.error('Error fetching hotel and room images:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra khi lấy thông tin.', error: error.message });
  }
});

router.get('/:hotelId/rooms', async (req, res) => {
  const { hotelId } = req.params;

  try {
    // Tìm khách sạn theo hotelId
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ message: 'Khách sạn không tồn tại' });
    }

    // Lấy danh sách phòng liên quan đến khách sạn
    const rooms = await Room.find({ hotel: hotelId }); // Giả sử bạn đã có trường 'hotel' trong model Room
    res.status(200).json(rooms);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy thông tin phòng' });
  }
});

module.exports = router;

// Lấy tất cả các đánh giá theo hotelId
router.get('/:hotelId/ratings', async (req, res) => {
  try {
    const { hotelId } = req.params;
    const ratings = await Rate.find({ hotel: hotelId })
      .populate('user', 'name avatar') // Lấy thông tin người dùng
      .exec();

    res.json(ratings);
  } catch (error) {
    res.status(500).json({ message: 'Có lỗi xảy ra khi lấy đánh giá' });
  }
});
module.exports = router;
