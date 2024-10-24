// routes/checkout/checkout.js
const express = require('express');
const router = express.Router();
const Room = require('../../models/Room'); // Mô hình phòng trong database
const Booking = require('../../models/Booking'); // Mô hình đặt phòng
const axios = require('axios');
const crypto = require('crypto');

// API để lấy chi tiết phòng dựa trên roomId
router.get('/:roomId', async (req, res) => {
  try {
    const room = await Room.findById(req.params.roomId); // Lấy thông tin phòng từ MongoDB
    if (!room) {
      return res.status(404).json({ message: 'Phòng không tồn tại' });
    }
    res.json(room);
  } catch (error) {
    console.error('Lỗi khi lấy thông tin phòng:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra khi lấy thông tin phòng' });
  }
});

// API để xử lý thanh toán với MoMo
router.post('/payment', async (req, res) => {
  const accessKey = 'F8BBA842ECF85';
  const secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
  const orderInfo = 'pay with MoMo';
  const partnerCode = 'MOMO';
  const redirectUrl = 'http://localhost:3000/'; // Địa chỉ redirect về sau khi thanh toán
  const ipnUrl = 'http://localhost:3000/login';
  const requestType = "payWithMethod";
  const amount = req.body.amount; // Lấy số tiền từ yêu cầu
  const orderId = partnerCode + new Date().getTime();
  const requestId = orderId;
  const extraData = '';
  const autoCapture = true;
  const lang = 'vi';

  // Tạo raw signature
  const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

  // Tạo chữ ký
  const signature = crypto.createHmac('sha256', secretKey)
    .update(rawSignature)
    .digest('hex');

  // Tạo json object gửi đến MoMo endpoint
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

  // Gửi yêu cầu đến MoMo
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
    const response = await axios(options);
    res.json(response.data); // Trả về dữ liệu từ MoMo
  } catch (error) {
    console.error('Lỗi khi thanh toán:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra khi thanh toán' });
  }
});

// API để lưu booking sau khi thanh toán thành công
router.post('/confirm', async (req, res) => {
  const { userId, roomId, checkInDate, checkOutDate, paymentStatus } = req.body;

  const newBooking = new Booking({
    user: userId,
    room: roomId,
    checkInDate: new Date(checkInDate),
    checkOutDate: new Date(checkOutDate),
    bookingDate: new Date(), // Ngày đặt phòng là ngày hiện tại
    paymentStatus: paymentStatus, // Trạng thái thanh toán
  });

  try {
    await newBooking.save();
    res.status(201).json({ message: 'Đặt phòng thành công', newBooking });
  } catch (error) {
    console.error('Lỗi khi lưu booking:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra khi lưu thông tin đặt phòng' });
  }
});

module.exports = router;
