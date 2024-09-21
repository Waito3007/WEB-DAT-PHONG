const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

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
      return res.status(400).json({ msg: 'Email không tồn tại' });
    }

    // So sánh mật khẩu
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Mật khẩu không đúng' });
    }

    // Tạo token JWT nếu mật khẩu đúng
    const payload = { userId: user._id };
    const token = jwt.sign(payload, 'yourSecretKey', { expiresIn: '1h' });

    res.json({ token, msg: 'Đăng nhập thành công' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Lỗi server' });
  }
});

module.exports = router;
