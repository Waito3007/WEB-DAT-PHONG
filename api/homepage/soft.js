const express = require('express');
const router = express.Router();
const Hotel = require('../../models/Hotel');
const Rate = require('../../models/Rate');
const Room = require('../../models/Room');

// Route lấy 4 khách sạn có nhiều đánh giá nhất, đánh giá cao nhất
router.get('/top4hotel', async (req, res) => {
  try {
    const topHotels = await Hotel.aggregate([
      {
        $lookup: {
          from: 'rates',
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
          reviewsCount: { $size: '$reviews' }, 
          averageRating: { $avg: '$reviews.rating' } 
        }
      },
      { 
        $sort: { reviewsCount: -1, averageRating: -1 } // Sắp xếp theo số lượng đánh giá và điểm trung bình
      },
      { 
        $limit: 4 //trả về 4 khách sạn
      }
    ]);

    // Lấy giá phòng thấp nhất và cao nhất
    const hotelsWithPriceRange = await Promise.all(
      topHotels.map(async hotel => {
        const rooms = await Room.find({ hotel: hotel._id }).sort({ price: 1 }); // Sắp xếp giá phòng từ thấp đến cao
        const lowestPrice = rooms.length > 0 ? rooms[0].price : null;
        const highestPrice = rooms.length > 0 ? rooms[rooms.length - 1].price : null;
        return {
          ...hotel,
          lowestPrice,  // Giá thấp nhất
          highestPrice  // Giá cao nhất
        };
      })
    );
    if (hotelsWithPriceRange.length === 0) {
      return res.status(404).json({ msg: 'Không có khách sạn nào' });
    }
    res.status(200).json(hotelsWithPriceRange); // Trả về danh sách 4 khách sạn kèm giá thấp nhất và cao nhất
  } catch (err) {
    console.error('Lỗi server:', err);
    res.status(500).json({ msg: 'Lỗi server' });
  }
});


router.get('/random-hotel', async (req, res) => {
  try {
    // Lấy ngẫu nhiên 4 khách sạn từ collection
    const randomHotels = await Hotel.aggregate([
      { $sample: { size: 4 } } // Random lấy 4 khách sạn bất kỳ
    ]);

    // Lấy giá phòng thấp nhất và cao nhất cho mỗi khách sạn
    const hotelsWithPriceRange = await Promise.all(
      randomHotels.map(async hotel => {
        const rooms = await Room.find({ hotel: hotel._id }).sort({ price: 1 }); // Sắp xếp giá phòng từ thấp đến cao
        const lowestPrice = rooms.length > 0 ? rooms[0].price : null;
        const highestPrice = rooms.length > 0 ? rooms[rooms.length - 1].price : null;

        return {
          ...hotel,
          lowestPrice,  // Giá thấp nhất
          highestPrice  // Giá cao nhất
        };
      })
    );

    if (hotelsWithPriceRange.length === 0) {
      return res.status(404).json({ msg: 'Không có khách sạn nào' });
    }

    res.status(200).json(hotelsWithPriceRange); // Trả về danh sách khách sạn kèm giá thấp nhất và cao nhất
  } catch (err) {
    console.error('Lỗi server:', err);
    res.status(500).json({ msg: 'Lỗi server' });
  }
});


module.exports = router;
