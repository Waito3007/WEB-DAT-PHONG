// server.js
const express = require('express');
const connectDB = require('./config/db');
const userRoutes = require('./routes/register'); // Nhập route người dùng
const loginRoute = require('./routes/login');
const app = express();

// Kết nối đến MongoDB
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use('/api/users', userRoutes); // Đăng ký route
app.use('/api/users', loginRoute); // Route cho đăng nhập

app.get('/', (req, res) => {
  res.send('Welcome to Hotel Booking API');
});

// Lắng nghe trên cổng
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
