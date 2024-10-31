// server.js
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const userapi = require('./api/account/register'); // Nhập route người dùng
const loginRoute = require('./api/account/login');
const userTableRouter = require('./api/dashboard/usertable');
const hotelapi = require('./api/hotel_manager/hotel');
const Room = require('./api/hotel_manager/room'); 
const Profile = require('./api/account/profile'); 
const Booking = require('./api/booking/booking'); 
const HomePage = require('./api/homepage/tophotel');// Đường dẫn mới cho room
const Detail = require('./api/detail/detail');
const Checkout = require('./api/checkout/checkout');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const app = express();
// Kết nối đến MongoDB
connectDB();
// Sử dụng cookie-parser
app.use(cookieParser()); // Đặt cookie-parser trước các route
app.use(express.json()); // Để phân tích JSON trong request
// Gọi dotenv
dotenv.config();
// Middleware
app.use(express.json());
// api
app.use('/api/users', userapi); // Đăng ký route
app.use('/api/users', loginRoute); // Route cho đăng nhập
app.use('/api/profile', Profile);
app.use('/api/usertable', userTableRouter); // Router lấy list người dùng
app.use('/api/room', Room); // Thêm route cho phòng
app.use('/api/hotel', hotelapi);
app.use('/api/homepage', HomePage);
app.use('/api/booking', Booking);
app.use('/api/detail', Detail);
app.use('/api/checkout', Checkout);
app.get('/', (req, res) => {
  res.send('Welcome to Hotel Booking API');
  
});
app.use(cors({
  origin: 'http://localhost:3000' // Cho phép yêu cầu từ frontend
}));
// Lắng nghe trên cổng
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  
});

