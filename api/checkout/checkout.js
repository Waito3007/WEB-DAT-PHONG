const express = require('express');
const router = express.Router();
const Room = require('../../models/Room'); // Model Room
const Booking = require('../../models/Booking'); // Model Booking
const axios = require('axios');
const crypto = require('crypto');

// API lấy thông tin chi tiết phòng dựa trên roomId
router.get('/:roomId', async (req, res) => {
  try {
    const room = await Room.findById(req.params.roomId);
    if (!room) {
      return res.status(404).json({ message: 'Phòng không tồn tại' });
    }
    res.json(room);
  } catch (error) {
    console.error('Lỗi khi lấy thông tin phòng:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra khi lấy thông tin phòng' });
  }
});

// API thanh toán qua MoMo
router.post('/payment', async (req, res) => {
  const accessKey = 'F8BBA842ECF85';
  const secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
  const orderInfo = 'pay with MoMo';
  const partnerCode = 'MOMO';
  const redirectUrl = 'http://localhost:3000/success'; // Chuyển hướng về trang success
  const ipnUrl = 'payWithMethod'; 
  const requestType = "payWithMethod";
  const amount = req.body.amount;
  const orderId = partnerCode + new Date().getTime(); // Tạo orderId duy nhất
  const requestId = orderId;
  const extraData = '';
  const autoCapture = true;
  const lang = 'vi';

  const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
  const signature = crypto.createHmac('sha256', secretKey)
    .update(rawSignature)
    .digest('hex');

  const requestBody = JSON.stringify({
    partnerCode: partnerCode,
    partnerName: "Test",
    storeId: "MomoTestStore",
    requestId: requestId,
    amount: amount,
    orderId: orderId,
    orderInfo: orderInfo,
    redirectUrl: redirectUrl,
    ipnUrl: ipnUrl,
    lang: lang,
    requestType: requestType,
    autoCapture: autoCapture,
    extraData: extraData,
    signature: signature
  });

  const options = {
    method: 'POST',
    url: 'https://test-payment.momo.vn/v2/gateway/api/create',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(requestBody)
    },
    data: requestBody
  };

  try {
    console.log('Gửi yêu cầu thanh toán MoMo:', requestBody);
    const response = await axios(options);
    console.log('Phản hồi từ MoMo:', response.data);

    // Sau khi nhận được payUrl, gửi yêu cầu xác nhận booking
    const confirmResponse = await axios.post('http://localhost:5000/api/checkout/confirm', {
      userId: req.body.userId,
      roomId: req.body.roomId,
      checkInDate: req.body.checkInDate,
      checkOutDate: req.body.checkOutDate,
      phoneBooking: req.body.phoneBooking,
      emailBooking: req.body.emailBooking,
      paymentStatus: 'Pending',
      orderId: orderId // Gửi orderId để lưu vào booking
    });

    res.json({ payUrl: response.data.payUrl, orderId: orderId, bookingId: confirmResponse.data.bookingId });
  } catch (error) {
    console.error('Lỗi khi thanh toán:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra khi thanh toán' });
  }
});

/// Định nghĩa API xác nhận booking
router.post('/confirmchange', async (req, res) => {
  const { orderId } = req.body;

  if (!orderId) {
    return res.status(400).json({ message: 'Mã đơn hàng không được cung cấp' });
  }

  try {
    // Tìm booking dựa trên orderId
    const booking = await Booking.findOne({ orderId: orderId });

    if (!booking) {
      return res.status(404).json({ message: 'Không tìm thấy booking' });
    }

    // Nếu tìm thấy booking, bạn có thể lấy _id
    const bookingId = booking._id; // Khóa chính của booking

    // Cập nhật paymentStatus từ Pending thành Complete
    booking.paymentStatus = 'Complete';
    await booking.save();

    return res.status(200).json({
      message: 'Xác nhận booking thành công',
      bookingId: bookingId, // Trả về bookingId nếu cần
      booking, // Trả về thông tin booking đã cập nhật
    });
  } catch (error) {
    console.error('Lỗi khi xác nhận booking:', error);
    return res.status(500).json({ message: 'Đã xảy ra lỗi trong quá trình xác nhận booking' });
  }
});


// API xác nhận và lưu booking sau khi thanh toán thành công
router.post('/confirm', async (req, res) => {
  const { userId, roomId, checkInDate, checkOutDate, phoneBooking, emailBooking, paymentStatus, orderId } = req.body;

  const newBooking = new Booking({
    user: userId ? userId : undefined,
    room: roomId,
    bookingDate: new Date(),
    checkInDate: new Date(checkInDate),
    checkOutDate: new Date(checkOutDate),
    phoneBooking: phoneBooking,
    emailBooking: emailBooking,
    paymentStatus: paymentStatus || 'Pending',
    orderId: orderId
  });

  try {
    const savedBooking = await newBooking.save();
    res.status(201).json({ message: 'Đặt phòng thành công', bookingId: savedBooking._id });
  } catch (error) {
    console.error('Lỗi khi lưu booking:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra khi lưu thông tin đặt phòng' });
  }
});
// API kiểm tra trạng thái thanh toán
router.get('/payment-status/:orderId', async (req, res) => {
  const { orderId } = req.params;
  try {
    const booking = await Booking.findOne({ orderId: orderId });
    if (booking) {
      res.json({ paymentStatus: booking.paymentStatus });
    } else {
      res.status(404).json({ message: 'Không tìm thấy booking' });
    }
  } catch (error) {
    console.error('Lỗi khi kiểm tra trạng thái thanh toán:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra khi kiểm tra trạng thái' });
  }
});

module.exports = router;
