const express = require('express');
const router = express.Router();
const Hotel = require('../../models/Hotel');
const Room = require('../../models/Room');

// Cache để lưu kết quả search
let searchCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes cache

router.get('/Search', async (req, res) => {
  try {
    // Check cache first
    const now = Date.now();
    if (searchCache && cacheTimestamp && (now - cacheTimestamp < CACHE_DURATION)) {
      res.set('Cache-Control', 'public, max-age=120');
      return res.status(200).json(searchCache);
    }

    // Sử dụng aggregation pipeline tối ưu để lấy tất cả data trong 1 query
    const hotelsWithDetails = await Hotel.aggregate([
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
            {
              $project: {
                roomType: 1,
                price: 1,
                amenities: 1,
                description: 1
              }
            }
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
          lowestRoomPrice: {
            $cond: {
              if: { $gt: [{ $size: '$rooms' }, 0] },
              then: { $min: '$rooms.price' },
              else: null
            }
          },
          highestRoomPrice: {
            $cond: {
              if: { $gt: [{ $size: '$rooms' }, 0] },
              then: { $max: '$rooms.price' },
              else: null
            }
          },
          rooms: {
            $slice: ['$rooms', 3] // Chỉ lấy 3 rooms đầu tiên để giảm data
          }
        }
      },
      {
        $sort: { reviewsCount: -1, averageRating: -1 } // Sort by popularity
      }
    ]);

    if (hotelsWithDetails.length === 0) {
      return res.status(404).json({ msg: 'Không có khách sạn nào' });
    }

    // Cache the result
    searchCache = hotelsWithDetails;
    cacheTimestamp = now;

    res.set('Cache-Control', 'public, max-age=120');
    res.status(200).json(hotelsWithDetails);
  } catch (err) {
    console.error('Lỗi server:', err);
    res.status(500).json({ msg: 'Lỗi server' });
  }
});

// API phân trang cho performance tốt hơn
router.get('/SearchPaginated', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [hotels, totalCount] = await Promise.all([
      Hotel.aggregate([
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
              { $limit: 2 }, // Chỉ lấy 2 rooms để preview
              {
                $project: {
                  roomType: 1,
                  price: 1,
                  amenities: { $slice: ['$amenities', 3] }, // Chỉ lấy 3 amenities đầu
                  description: { $substr: ['$description', 0, 100] } // Chỉ lấy 100 ký tự đầu
                }
              }
            ]
          }
        },
        {
          $project: {
            name: 1,
            location: 1,
            description: { $substr: ['$description', 0, 150] }, // Limit description
            imagehotel: { $slice: ['$imagehotel', 1] }, // Chỉ lấy 1 ảnh đầu
            reviewsCount: { $size: '$reviews' },
            averageRating: { 
              $cond: {
                if: { $gt: [{ $size: '$reviews' }, 0] },
                then: { $avg: '$reviews.rating' },
                else: 0
              }
            },
            lowestRoomPrice: {
              $cond: {
                if: { $gt: [{ $size: '$rooms' }, 0] },
                then: { $min: '$rooms.price' },
                else: null
              }
            },
            highestRoomPrice: {
              $cond: {
                if: { $gt: [{ $size: '$rooms' }, 0] },
                then: { $max: '$rooms.price' },
                else: null
              }
            },
            rooms: '$rooms'
          }
        },
        { $sort: { reviewsCount: -1, averageRating: -1 } },
        { $skip: skip },
        { $limit: limit }
      ]),
      Hotel.countDocuments()
    ]);

    res.set('Cache-Control', 'public, max-age=60');
    res.status(200).json({
      hotels,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      }
    });
  } catch (err) {
    console.error('Lỗi server:', err);
    res.status(500).json({ msg: 'Lỗi server' });
  }
});

module.exports = router;
