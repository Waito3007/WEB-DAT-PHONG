const express = require('express');
const router = express.Router();
const Booking = require('../../models/Booking');
const User = require('../../models/User');
const Hotel = require('../../models/Hotel');
const auth = require('../../middleware/auth');
const axios = require('axios');
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.userId;

    // Truy vấn các booking của người dùng và lấy thông tin Room và Hotel liên quan
    const bookings = await Booking.find({ user: userId })
      .populate({
        path: 'room',
        select: 'type price imageroom hotel', // Lấy thêm `hotel` từ Room
        populate: {
          path: 'hotel', // Populate Hotel qua Room
          select: 'name location description stars imagehotel', // Chọn các trường từ Hotel
        },
      })
      .select('checkInDate checkOutDate phoneBooking emailBooking paymentStatus orderId bookingDate');

    // Kiểm tra nếu không có đặt phòng nào được tìm thấy
    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy đặt phòng nào' });
    }

    // Trả về dữ liệu booking bao gồm thông tin Room và Hotel
    res.json(bookings);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách đặt phòng:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra khi lấy danh sách đặt phòng' });
  }
});
// Đoạn mã cho API lấy danh sách khách sạn của người quản lý
router.get('/hotelbooking', auth, async (req, res) => {
  try {
    const managerId = req.userId; // Lấy userId từ middleware

    const hotels = await Hotel.find({ manager: managerId })
      .populate('manager', 'name email'); 

    res.status(200).json(hotels);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Lỗi server' });
  }
});


router.get('/booking/admin', auth, async (req, res) => {
  try {
    const userId = req.userId;

    // Truy vấn để lấy thông tin người dùng, bao gồm cả vai trò
    const user = await User.findById(userId).select('role'); // Chỉ lấy trường role

    if (!user) {
      return res.status(404).json({ message: 'Người dùng không tồn tại' });
    }

    const userRole = user.role; // Lấy vai trò từ thông tin người dùng

    let bookings;

    // Lấy tất cả booking nếu là Admin
    if (userRole === 'Admin') {
      bookings = await Booking.find()
        .populate({
          path: 'room',
          select: 'type price imageroom hotel',
          populate: {
            path: 'hotel',
            select: 'name location description stars imagehotel',
          },
        })
        .select('checkInDate checkOutDate phoneBooking emailBooking paymentStatus orderId bookingDate');

      // Kiểm tra nếu không có đặt phòng nào được tìm thấy
      if (!bookings || bookings.length === 0) {
        return res.status(404).json({ message: 'Không tìm thấy đặt phòng nào' });
      }

      // Trả về dữ liệu booking bao gồm thông tin Room và Hotel
      return res.json(bookings);
    } else {
      return res.status(403).json({ message: 'Bạn không có quyền truy cập vào dữ liệu này' });
    }
  } catch (error) {
    console.error('Lỗi khi lấy danh sách đặt phòng:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra khi lấy danh sách đặt phòng' });
  }
});
// API để lấy danh sách đặt phòng theo userId từ token
router.get('/booking/manager', auth, async (req, res) => {
  try {
    const userId = req.userId;

    // Tìm các khách sạn mà người dùng sở hữu
    const hotels = await Hotel.find({ manager: userId }).select('_id rooms'); // Lấy khách sạn theo manager

    if (!hotels || hotels.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy khách sạn nào mà bạn sở hữu.' });
    }

    // Lấy tất cả roomIds từ các khách sạn
    const roomIds = hotels.flatMap(hotel => hotel.rooms);

    // Tìm các booking có phòng thuộc các khách sạn mà người dùng sở hữu
    const bookings = await Booking.find({ room: { $in: roomIds } })
      .populate({
        path: 'room',
        select: 'type price imageroom hotel',
        populate: {
          path: 'hotel',
          select: 'name location description stars imagehotel',
        },
      })
      .select('checkInDate checkOutDate phoneBooking emailBooking paymentStatus orderId bookingDate user'); // Lấy user trong booking

    // Kiểm tra nếu không có đặt phòng nào được tìm thấy
    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy đặt phòng nào.' });
    }

    // Lấy thông tin người dùng cho mỗi booking
    const bookingsWithUserData = await Promise.all(bookings.map(async (booking) => {
      const user = await User.findById(booking.user).select('name email'); // Lấy thông tin người dùng
      return {
        ...booking.toObject(),
        user: user || { name: 'Người dùng không tồn tại', email: '' }, // Nếu không tìm thấy người dùng, trả về thông báo
      };
    }));

    // Trả về dữ liệu booking bao gồm thông tin Room, Hotel và User
    res.json(bookingsWithUserData);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách đặt phòng:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra khi lấy danh sách đặt phòng.' });
  }
});




module.exports = router;
