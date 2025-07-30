const axios = require('axios');

// Thông tin test booking MoMo callback
const testData = {
  resultCode: 0, // 0 là thanh toán thành công
  orderId: 'MOMO' + Date.now(),
  amount: 1000000,
  userId: '6', // Thay bằng _id user thực tế nếu muốn
  roomId: '2', // Thay bằng _id room thực tế nếu muốn
  checkInDate: '2025-08-01',
  checkOutDate: '2025-08-03',
  phoneBooking: '0123456789',
  emailBooking: 'test@example.com'
};

axios.post('http://localhost:5000/api/checkout/momo-callback', testData)
  .then(res => {
    console.log('Kết quả:', res.data);
  })
  .catch(err => {
    if (err.response) {
      console.error('Lỗi:', err.response.data);
    } else {
      console.error('Lỗi:', err.message);
    }
  });
