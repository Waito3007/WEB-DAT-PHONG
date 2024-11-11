const express = require('express');
const router = express.Router();
const Hotel = require('../../models/Hotel');
const Room = require('../../models/Room');
router.get('/Search', async (req, res) => {
  try {
    const allHotels = await Hotel.aggregate([
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
      }
    ]);
    const hotelsWithRoomDetails = await Promise.all(
      allHotels.map(async hotel => {
        const rooms = await Room.find({ hotel: hotel._id }).sort({ price: 1 });
        const roomDetails = rooms.map(room => ({
          roomType: room.roomType,
          price: room.price,
          amenities: room.amenities,
          description: room.description
        }));
        const lowestRoomPrice = rooms.length > 0 ? rooms[0].price : null;

        return { ...hotel, lowestRoomPrice, rooms: roomDetails };
      })
    );
    if (hotelsWithRoomDetails.length === 0) {
      return res.status(404).json({ msg: 'Không có khách sạn nào' });
    }

    res.status(200).json(hotelsWithRoomDetails);
  } catch (err) {
    console.error('Lỗi server:', err);
    res.status(500).json({ msg: 'Lỗi server' });
  }
});



module.exports = router;
