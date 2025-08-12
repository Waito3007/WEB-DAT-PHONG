const express = require('express');
const router = express.Router();
const Hotel = require('../../models/Hotel');
const Rate = require('../../models/Rate');
const Room = require('../../models/Room');

// Route lấy 4 khách sạn có nhiều đánh giá nhất, đánh giá cao nhất
router.get('/top4hotel', async (req, res) => {
  try {
    // Sử dụng aggregation pipeline tối ưu hóa
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
        $lookup: {
          from: 'rooms',
          localField: '_id',
          foreignField: 'hotel',
          as: 'rooms',
          pipeline: [
            { $sort: { price: 1 } },
            { $group: {
              _id: '$hotel',
              lowestPrice: { $first: '$price' },
              highestPrice: { $last: '$price' }
            }}
          ]
        }
      },
      {
        $project: {
          name: 1,
          location: 1,
          description: 1,
          imagehotel: 1,
          reviewsCount: { $size: '$reviews' }, 
          averageRating: { 
            $cond: {
              if: { $gt: [{ $size: '$reviews' }, 0] },
              then: { $avg: '$reviews.rating' },
              else: 0
            }
          },
          lowestPrice: { $arrayElemAt: ['$rooms.lowestPrice', 0] },
          highestPrice: { $arrayElemAt: ['$rooms.highestPrice', 0] }
        }
      },
      { 
        $sort: { reviewsCount: -1, averageRating: -1 }
      },
      { 
        $limit: 4
      }
    ]);

    if (topHotels.length === 0) {
      return res.status(404).json({ msg: 'Không có khách sạn nào' });
    }
    
    // Set cache headers
    res.set('Cache-Control', 'public, max-age=300'); // Cache 5 minutes
    res.status(200).json(topHotels);
  } catch (err) {
    console.error('Lỗi server:', err);
    res.status(500).json({ msg: 'Lỗi server' });
  }
});

router.get('/random-hotel', async (req, res) => {
  try {
    // Sử dụng aggregation pipeline tối ưu cho random hotels
    const randomHotels = await Hotel.aggregate([
      { $sample: { size: 4 } },
      {
        $lookup: {
          from: 'rooms',
          localField: '_id',
          foreignField: 'hotel',
          as: 'rooms',
          pipeline: [
            { $sort: { price: 1 } },
            { $group: {
              _id: '$hotel',
              lowestPrice: { $first: '$price' },
              highestPrice: { $last: '$price' }
            }}
          ]
        }
      },
      {
        $project: {
          name: 1,
          location: 1,
          description: 1,
          imagehotel: 1,
          lowestPrice: { $arrayElemAt: ['$rooms.lowestPrice', 0] },
          highestPrice: { $arrayElemAt: ['$rooms.highestPrice', 0] }
        }
      }
    ]);

    if (randomHotels.length === 0) {
      return res.status(404).json({ msg: 'Không có khách sạn nào' });
    }

    // Set cache headers
    res.set('Cache-Control', 'public, max-age=180'); // Cache 3 minutes cho random
    res.status(200).json(randomHotels);
  } catch (err) {
    console.error('Lỗi server:', err);
    res.status(500).json({ msg: 'Lỗi server' });
  }
});

module.exports = router;
