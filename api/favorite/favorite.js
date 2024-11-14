const express = require('express');
const mongoose = require('mongoose');
const Favorite = require('../../models/Favorite');
const Hotel = require('../../models/Hotel');  // Model Hotel
const Room = require('../../models/Room');  // Model Room
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

router.get('/', auth, async (req, res) => {
  try {
    const userId = req.userId; // Lấy userId từ middleware xác thực

    // Tìm tất cả các yêu thích của người dùng hiện tại
    const favorites = await Favorite.find({ userId }).populate('hotelId');

    // Xử lý để lấy thông tin khách sạn và giá phòng
    const favoriteHotels = await Promise.all(
      favorites.map(async (favorite) => {
        const hotel = await Hotel.findById(favorite.hotelId).lean();        
        // Tìm giá phòng thấp nhất và cao nhất của khách sạn
        const prices = await Room.find({ hotel: hotel._id })
          .select('price')
          .lean();
          
        const roomPrices = prices.map(room => room.price);
        const minPrice = Math.min(...roomPrices);
        const maxPrice = Math.max(...roomPrices);

        return {
          hotelId: hotel._id,
          name: hotel.name,
          location: hotel.location,
          imagehotel: hotel.imagehotel,
          stars: hotel.stars,
          minPrice,
          maxPrice,
        };
      })
    );

    res.json(favoriteHotels);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Lỗi máy chủ' });
  }
});

module.exports = router;
