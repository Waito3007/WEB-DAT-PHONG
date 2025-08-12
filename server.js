// server.js
const express = require('express');
const cors = require('cors');
const compression = require('compression'); // Thêm compression
const helmet = require('helmet'); // Thêm security headers
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

// Gọi dotenv trước tiên
dotenv.config();

// Kết nối đến MongoDB
connectDB();

// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false // Tắt COEP để tránh conflict với CORS
}));

// Compression middleware để giảm kích thước response
app.use(compression());

// Request timeout để tránh request bị treo
app.use((req, res, next) => {
  req.setTimeout(30000); // 30 seconds timeout
  res.setTimeout(30000);
  next();
});

// Rate limiting để tránh spam requests
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 phút
  max: 100, // Tối đa 100 requests mỗi phút
  message: 'Quá nhiều requests, vui lòng thử lại sau.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Sử dụng cookie-parser
app.use(cookieParser()); // Đặt cookie-parser trước các route

// JSON parsing với limit để tránh large payloads
app.use(express.json({ limit: '10mb' })); // Để phân tích JSON trong request
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS Configuration - Đặt trước các routes
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001', 
  'https://web-dat-phong.onrender.com',
  'https://web-dat-phong.vercel.app', // Frontend domain chính
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
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400 // Cache preflight requests for 24 hours
}));

// Cache control middleware
app.use((req, res, next) => {
  // Cache static data for 5 minutes
  if (req.method === 'GET' && !req.path.includes('/profile/me') && !req.path.includes('/booking')) {
    res.set('Cache-Control', 'public, max-age=300'); // 5 minutes
  }
  next();
});

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

