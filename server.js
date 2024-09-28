// server.js
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/register'); // Nhập route người dùng
const loginRoute = require('./routes/login');
const userTableRouter = require('./routes/usertable');
const hotelRoutes = require('./routes/hotel');
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

// Routes
app.use('/api/users', userRoutes); // Đăng ký route
app.use('/api/users', loginRoute); // Route cho đăng nhập
app.use('/api/hotels', hotelRoutes);
app.use('/api/usertable', userTableRouter); // Router lấy list người dùng
app.use('/api/hotel', hotelRoutes);
// up anh
app.get('/', (req, res) => {
  res.send('Welcome to Hotel Booking API');
});

// Lắng nghe trên cổng
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
