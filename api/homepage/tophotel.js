const express = require('express');
const router = express.Router();
const Hotel = require('../../models/Hotel');
const Rate = require('../../models/Rate');
const Room = require('../../models/Room');

// Route lấy 4 khách sạn có nhiều đánh giá nhất, đánh giá cao nhất, và giá phòng thấp nhất
router.get('/top4hotel', async (req, res) => {
  try {
    // Tính toán điểm đánh giá trung bình và số lượng đánh giá cho từng khách sạn
    const topHotels = await Hotel.aggregate([
      {
        $lookup: {
          from: 'rates', // Tên collection "rates" từ model Rate
          localField: '_id',
          foreignField: 'hotel',
          as: 'reviews'
        }
      },
      {
        $project: {
          name: 1,
          location: 1,
          description: 1,
          imagehotel: 1,
          reviewsCount: { $size: '$reviews' }, // Số lượng đánh giá
          averageRating: { $avg: '$reviews.rating' } // Điểm đánh giá trung bình
        }
      },
      { 
        $sort: { reviewsCount: -1, averageRating: -1 } // Sắp xếp theo số lượng đánh giá và điểm trung bình
      },
      { 
        $limit: 4 // Giới hạn kết quả trả về 4 khách sạn
      }
    ]);

    // Lấy giá phòng thấp nhất cho mỗi khách sạn
    const hotelsWithLowestPrice = await Promise.all(
      topHotels.map(async hotel => {
        const rooms = await Room.find({ hotel: hotel._id }).sort({ price: 1 }).limit(1); // Lấy phòng có giá thấp nhất
        const lowestRoomPrice = rooms.length > 0 ? rooms[0].price : null;

        return {
          ...hotel,
          lowestRoomPrice
        };
      })
    );

    if (hotelsWithLowestPrice.length === 0) {
      return res.status(404).json({ msg: 'Không có khách sạn nào' });
    }

    res.status(200).json(hotelsWithLowestPrice); // Trả về danh sách 4 khách sạn kèm giá phòng thấp nhất
  } catch (err) {
    console.error('Lỗi server:', err);
    res.status(500).json({ msg: 'Lỗi server' });
  }
});

module.exports = router;
