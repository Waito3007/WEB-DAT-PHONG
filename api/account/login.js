const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

// Sử dụng cookie-parser
router.use(cookieParser());

// Route Đăng nhập người dùng
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Kiểm tra xem email và mật khẩu có được cung cấp không
    if (!email || !password) {
      return res.status(400).json({ msg: 'Vui lòng nhập email và mật khẩu' });
    }
    // Tìm người dùng trong cơ sở dữ liệu
    const user = await User.findOne({ email });
    if (!user) {
      console.log("Email không tồn tại:", email);
      return res.status(400).json({ msg: 'Email không tồn tại' });
    }

    // So sánh mật khẩu
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log("Mật khẩu không đúng cho email:", email);
      return res.status(400).json({ msg: 'Mật khẩu không đúng' });
    }

    // Tạo token
    const payload = { userId: user._id }; // Lưu trữ ID của người dùng trong token
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });

    // Gửi token cho client qua cookie
    res.cookie('token', token, { httpOnly: true, maxAge: 365 * 24 * 60 * 60 * 1000 });
    // Trả về thông báo đăng nhập thành công
    res.json({ msg: 'Đăng nhập thành công' });

  } catch (err) {
    console.error("Lỗi server:", err.message);
    res.status(500).json({ msg: 'Lỗi server' });
  }
});

module.exports = router;
