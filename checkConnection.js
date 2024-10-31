const mongoose = require('mongoose');
const Booking = require('./models/Booking'); // Đường dẫn đến mô hình Booking của bạn

// Kết nối đến MongoDB
mongoose.connect('mongodb+srv://sangvu:sangvu3007HSGamer@bookingweb.pdloq.mongodb.net/?retryWrites=true&w=majority&appName=BookingWeb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Hàm thêm dữ liệu
const addBookings = async () => {
  const bookings = [
    {
      room: '671c6161b435726ff7e14364',
      bookingDate: new Date('2024-08-28T16:04:22.485Z'), // Lùi thêm 1 tháng
      checkInDate: new Date('2024-08-30T00:00:00.000Z'), // Lùi thêm 1 tháng
      checkOutDate: new Date('2024-09-30T00:00:00.000Z'), // Lùi thêm 1 tháng
      phoneBooking: '0797841166',
      emailBooking: 'sangvufinal@gmail.com',
      paymentStatus: 'Complete',
      orderId: 'MOMO1730131462370'
    },
    {
      room: '671c6161b435726ff7e14364',
      bookingDate: new Date('2024-08-28T16:30:16.270Z'), // Lùi thêm 1 tháng
      checkInDate: new Date('2024-08-30T00:00:00.000Z'), // Lùi thêm 1 tháng
      checkOutDate: new Date('2024-10-01T00:00:00.000Z'), // Lùi thêm 1 tháng
      phoneBooking: 'gg',
      emailBooking: 'gg',
      paymentStatus: 'Pending',
      orderId: 'MOMO1730133016100'
    },
    {
      room: '671c6161b435726ff7e14364',
      bookingDate: new Date('2024-08-28T16:33:41.858Z'), // Lùi thêm 1 tháng
      checkInDate: new Date('2024-08-30T00:00:00.000Z'), // Lùi thêm 1 tháng
      checkOutDate: new Date('2024-09-30T00:00:00.000Z'), // Lùi thêm 1 tháng
      phoneBooking: 'sad',
      emailBooking: 'sdad',
      paymentStatus: 'Complete',
      orderId: 'MOMO1730133221697'
    },
    {
      room: '671c6161b435726ff7e14364',
      bookingDate: new Date('2024-08-28T16:35:29.284Z'), // Lùi thêm 1 tháng
      checkInDate: new Date('2024-08-29T00:00:00.000Z'), // Lùi thêm 1 tháng
      checkOutDate: new Date('2024-09-30T00:00:00.000Z'), // Lùi thêm 1 tháng
      phoneBooking: 'hehehehe',
      emailBooking: 'hehehe',
      paymentStatus: 'Complete',
      orderId: 'MOMO1730133329177'
    },
    {
      room: '671c6161b435726ff7e14364',
      bookingDate: new Date('2024-08-29T03:47:27.271Z'), // Lùi thêm 1 tháng
      checkInDate: new Date('2024-08-30T00:00:00.000Z'), // Lùi thêm 1 tháng
      checkOutDate: new Date('2024-09-30T00:00:00.000Z'), // Lùi thêm 1 tháng
      phoneBooking: '0797841166',
      emailBooking: 'sangvu2015dp1@gmail.com',
      paymentStatus: 'Complete',
      orderId: 'MOMO1730173647124'
    },
    {
      room: '670fd77cc177bc6e363387c7',
      bookingDate: new Date('2024-08-30T10:39:28.729Z'), // Lùi thêm 1 tháng
      checkInDate: new Date('2024-08-28T00:00:00.000Z'), // Lùi thêm 1 tháng
      checkOutDate: new Date('2024-09-30T00:00:00.000Z'), // Lùi thêm 1 tháng
      phoneBooking: 'dsadad',
      emailBooking: 'sadad',
      paymentStatus: 'Complete',
      orderId: 'MOMO1730284768590'
    },
    {
      room: '670fd77cc177bc6e363387c7',
      bookingDate: new Date('2024-08-30T17:14:09.866Z'), // Lùi thêm 1 tháng
      checkInDate: new Date('2024-08-03T00:00:00.000Z'), // Lùi thêm 1 tháng
      checkOutDate: new Date('2024-09-17T00:00:00.000Z'), // Lùi thêm 1 tháng
      phoneBooking: '155',
      emailBooking: 'dinhhoanghuy20044@gmail.com',
      paymentStatus: 'Pending',
      orderId: 'MOMO1730308449679'
    },
    {
      room: '67134e75a8333ed870128b24',
      bookingDate: new Date('2024-08-30T17:14:09.866Z'), // Lùi thêm 1 tháng
      checkInDate: new Date('2024-08-03T00:00:00.000Z'), // Lùi thêm 1 tháng
      checkOutDate: new Date('2024-09-17T00:00:00.000Z'), // Lùi thêm 1 tháng
      phoneBooking: '155',
      emailBooking: 'dinhhoanghuy20044@gmail.com',
      paymentStatus: 'Pending',
      orderId: 'MOMO1730308449679'
    },// Bạn có thể thêm các booking khác tại đây
  ];

  try {
    await Booking.insertMany(bookings);
    console.log('Bookings added successfully');
  } catch (error) {
    console.error('Error adding bookings:', error);
  }
};

// Gọi hàm
addBookings();
