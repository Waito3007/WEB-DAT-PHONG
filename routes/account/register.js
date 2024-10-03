const express = require('express');
const router = express.Router();
const User = require('../../models/User');

// Route Đăng ký người dùng
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, registrationDate } = req.body;

    // Kiểm tra xem email có tồn tại không
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'Email đã tồn tại' });
    }

    // Tạo người dùng mới
    user = new User({ name, email, password, role, registrationDate });

    // Lưu người dùng vào database
    await user.save();

    res.status(201).json({ msg: 'Đăng ký thành công' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Lỗi server' });
  }
});

module.exports = router;
