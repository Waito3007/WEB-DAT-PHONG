// server.js
const express = require('express');
const connectDB = require('./config/db');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/register'); // Nhập route người dùng
const loginRoute = require('./routes/login');
const hotelRoutes = require('./routes/hotelRoutes'); // Đường dẫn chính xác đến file hotelRoutes
const userTableRouter = require('./routes/usertable');
const app = express();

// Kết nối đến MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(bodyParser.json());

// Routes
app.use('/api/users', userRoutes); // Đăng ký route
app.use('/api/users', loginRoute); // Route cho đăng nhập
app.use('/api/hotels', hotelRoutes);
app.use('/api/usertable', userTableRouter); // Router lấy list người dùng
app.get('/', (req, res) => {
  res.send('Welcome to Hotel Booking API');
});

// Lắng nghe trên cổng
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});





