// server.js

// Luôn đặt dotenv.config() lên đầu để nạp biến môi trường
const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path'); // Thêm 'path' để làm việc với đường dẫn file
const connectDB = require('./config/db');

// Import routes
const userapi = require('./api/account/register');
const loginRoute = require('./api/account/login');
const userTableRouter = require('./api/dashboard/usertable');
const hotelapi = require('./api/hotel_manager/hotel');
const Room = require('./api/hotel_manager/room');
const Profile = require('./api/account/profile');
const Booking = require('./api/booking/booking');
const HomePage = require('./api/homepage/soft');
const Detail = require('./api/detail/detail');
const Checkout = require('./api/checkout/checkout');
const SearchHotel = require('./api/search/searchhotel');
const Favorite = require('./api/favorite/favorite');
const tinhthanhvn = require('./api/tinhthanhvn');

// Khởi tạo app Express
const app = express();

// Kết nối đến MongoDB
connectDB();

// --- MIDDLEWARE (Thực thi theo thứ tự này) ---
// 1. Cấu hình CORS - phải đặt trước các routes
// Cấu hình này sẽ cho phép mọi nguồn gốc, phù hợp cho Render
app.use(cors()); 

// 2. Middleware để phân tích JSON và cookie
app.use(express.json()); // Để phân tích JSON trong request (chỉ cần 1 dòng)
app.use(cookieParser());


// --- API ROUTES ---
app.use('/api/users', userapi);
app.use('/api/users', loginRoute);
app.use('/api/profile', Profile);
app.use('/api/usertable', userTableRouter);
app.use('/api/room', Room);
app.use('/api/hotel', hotelapi);
app.use('/api/homepage', HomePage);
app.use('/api/booking', Booking);
app.use('/api/detail', Detail);
app.use('/api/checkout', Checkout);
app.use('/api/searchhotel', SearchHotel);
app.use('/api/tinhthanh', tinhthanhvn);
app.use('/api/favorite', Favorite);

// --- PHỤC VỤ FRONTEND (React) ---
// Phải đặt sau các API routes
const buildPath = path.join(__dirname, 'build');
app.use(express.static(buildPath));

// Với tất cả các request khác không khớp với API, trả về file index.html của React
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});


// --- Lắng nghe trên cổng ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server đang chạy trên cổng ${PORT}`);
});