const express = require('express');
const router = express.Router();
const Booking = require('../../models/Booking'); // Đường dẫn tới model Booking
const Room = require('../../models/Room'); // Đường dẫn tới model Room
const auth = require('../../middleware/auth'); // Sử dụng middleware auth

// API lấy danh sách đặt phòng của user hiện tại
router.get('/', auth, async (req, res) => {
    try {
      const userId = req.userId; // Sử dụng req.userId từ middleware
      const bookings = await Booking.find({ user: userId })
        .populate({
          path: 'room',
          select: 'type price imageroom',
        })
        .select('checkInDate checkOutDate phoneBooking emailBooking paymentStatus orderId bookingDate');
  
      if (!bookings || bookings.length === 0) {
        return res.status(404).json({ message: 'Không tìm thấy đặt phòng nào' });
      }
  
      res.json(bookings);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách đặt phòng:', error);
      res.status(500).json({ message: 'Có lỗi xảy ra khi lấy danh sách đặt phòng' });
    }
  });
  

module.exports = router;
