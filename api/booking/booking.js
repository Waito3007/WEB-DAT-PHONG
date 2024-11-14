const express = require("express");
const router = express.Router();
const Booking = require("../../models/Booking");
const User = require("../../models/User");
const Hotel = require("../../models/Hotel");
const Room = require("../../models/Room");
const auth = require("../../middleware/auth");
const axios = require("axios");
router.get("/", auth, async (req, res) => {
  try {
    const userId = req.userId;

    // Truy vấn các booking của người dùng và lấy thông tin Room và Hotel liên quan
    const bookings = await Booking.find({ user: userId })
      .populate({
        path: "room",
        select: "type price imageroom hotel", // Lấy thêm `hotel` từ Room
        populate: {
          path: "hotel", // Populate Hotel qua Room
          select: "name location description stars imagehotel ", // Chọn các trường từ Hotel
        },
      })
      .select(
        "checkInDate checkOutDate phoneBooking emailBooking paymentStatus orderId bookingDate priceBooking"
      );

    // Kiểm tra nếu không có đặt phòng nào được tìm thấy
    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy đặt phòng nào" });
    }

    // Trả về dữ liệu booking bao gồm thông tin Room và Hotel
    res.json(bookings);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách đặt phòng:", error);
    res
      .status(500)
      .json({ message: "Có lỗi xảy ra khi lấy danh sách đặt phòng" });
  }
});
// Đoạn mã cho API lấy danh sách khách sạn của người quản lý
router.get("/hotelbooking", auth, async (req, res) => {
  try {
    const managerId = req.userId; // Lấy userId từ middleware

    const hotels = await Hotel.find({ manager: managerId }).populate(
      "manager",
      "name email"
    );

    res.status(200).json(hotels);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Lỗi server" });
  }
});

router.get("/booking/admin", auth, async (req, res) => {
  try {
    const userId = req.userId;

    // Truy vấn để lấy thông tin người dùng, bao gồm cả vai trò
    const user = await User.findById(userId).select("role"); // Chỉ lấy trường role

    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    const userRole = user.role; // Lấy vai trò từ thông tin người dùng

    let bookings;

    // Lấy tất cả booking nếu là Admin
    if (userRole === "Admin") {
      bookings = await Booking.find()
        .populate({
          path: "room",
          select: "type price imageroom hotel",
          populate: {
            path: "hotel",
            select: "name location description stars imagehotel",
          },
        })
        .select(
          "checkInDate checkOutDate phoneBooking emailBooking paymentStatus orderId bookingDate priceBooking"
        );

      // Kiểm tra nếu không có đặt phòng nào được tìm thấy
      if (!bookings || bookings.length === 0) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy đặt phòng nào" });
      }

      // Trả về dữ liệu booking bao gồm thông tin Room và Hotel
      return res.json(bookings);
    } else {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền truy cập vào dữ liệu này" });
    }
  } catch (error) {
    console.error("Lỗi khi lấy danh sách đặt phòng:", error);
    res
      .status(500)
      .json({ message: "Có lỗi xảy ra khi lấy danh sách đặt phòng" });
  }
});
// API để lấy danh sách đặt phòng theo userId từ token
router.get("/booking/manager", auth, async (req, res) => {
  try {
    const userId = req.userId;

    // Tìm các khách sạn mà người dùng sở hữu
    const hotels = await Hotel.find({ manager: userId }).select("_id rooms"); // Lấy khách sạn theo manager

    if (!hotels || hotels.length === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy khách sạn nào mà bạn sở hữu." });
    }

    // Lấy tất cả roomIds từ các khách sạn
    const roomIds = hotels.flatMap((hotel) => hotel.rooms);

    // Tìm các booking có phòng thuộc các khách sạn mà người dùng sở hữu
    const bookings = await Booking.find({ room: { $in: roomIds } })
      .populate({
        path: "room",
        select: "type price imageroom hotel",
        populate: {
          path: "hotel",
          select: "name location description stars imagehotel",
        },
      })
      .select(
        "checkInDate checkOutDate phoneBooking emailBooking paymentStatus orderId bookingDate user priceBooking"
      ); // Lấy user trong booking

    // Kiểm tra nếu không có đặt phòng nào được tìm thấy
    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy đặt phòng nào." });
    }

    // Lấy thông tin người dùng cho mỗi booking
    const bookingsWithUserData = await Promise.all(
      bookings.map(async (booking) => {
        const user = await User.findById(booking.user).select("name email"); // Lấy thông tin người dùng
        return {
          ...booking.toObject(),
          user: user || { name: "Người dùng không tồn tại", email: "" }, // Nếu không tìm thấy người dùng, trả về thông báo
        };
      })
    );

    // Trả về dữ liệu booking bao gồm thông tin Room, Hotel và User
    res.json(bookingsWithUserData);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách đặt phòng:", error);
    res
      .status(500)
      .json({ message: "Có lỗi xảy ra khi lấy danh sách đặt phòng." });
  }
});
// Cập nhật trạng thái booking
router.put("/:id/update-status", async (req, res) => {
  const { status } = req.body;
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { paymentStatus: status },
      { new: true }
    );
    res.json(booking);
  } catch (error) {
    res.status(500).send("Error updating status");
  }
});
// Cập nhật booking theo ID
router.put("/:id/update", async (req, res) => {
  const { email, name, phoneBooking, checkInDate, checkOutDate, totalPrice } =
    req.body;

  try {
    // Tìm booking theo ID
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Cập nhật thông tin booking
    booking.emailBooking = email || booking.emailBooking;
    booking.phoneBooking = phoneBooking || booking.phoneBooking;
    booking.checkInDate = new Date(checkInDate) || booking.checkInDate;
    booking.checkOutDate = new Date(checkOutDate) || booking.checkOutDate;
    booking.priceBooking = totalPrice || booking.priceBooking;

    // Cập nhật thông tin người dùng
    if (name) {
      const user = await User.findById(booking.user);
      if (user) {
        user.name = name;
        await user.save();
      }
    }
    // Tính toán lại tổng tiền
    const room = await Room.findById(booking.room);
    if (room) {
      const days =
        (new Date(checkOutDate) - new Date(checkInDate)) /
        (1000 * 60 * 60 * 24);
      booking.priceBooking = days * room.price; // Cập nhật giá booking theo số ngày lưu trú
    }
    // Lưu lại booking đã cập nhật
    await booking.save();
    // Trả về kết quả sau khi cập nhật
    res.status(200).json(booking);
  } catch (error) {
    console.error("Error updating booking:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

// Xóa booking theo ID
router.delete("/:id", async (req, res) => {
  const bookingId = req.params.id;

  try {
    const deletedBooking = await Booking.findByIdAndDelete(bookingId);
    if (!deletedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error("Error deleting booking:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
