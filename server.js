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
const HomePage = require('./api/homepage/soft');// Đường dẫn mới cho room
const Detail = require('./api/detail/detail');
const Checkout = require('./api/checkout/checkout');
const SearchHotel = require('./api/search/searchhotel');
const Favorite = require('./api/favorite/favorite');
const tinhthanhvn = require('./api/tinhthanhvn');
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

// CORS Configuration - Đặt trước các routes
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001', 
  'https://web-dat-phong.onrender.com',
  'https://web-dat-phong-frontend.vercel.app', // Thêm domain frontend nếu có
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Cho phép requests không có origin (mobile apps, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Cho phép cookies và headers authentication
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

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
app.use('/api/searchhotel', SearchHotel);
app.use('/api/tinhthanh', tinhthanhvn);
app.use('/api/favorite', Favorite);
app.get('/', (req, res) => {
  res.send('Welcome to Hotel Booking API');
  
});
// Lắng nghe trên cổng
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server đang chạy trên cổng ${PORT}`);
  
});

