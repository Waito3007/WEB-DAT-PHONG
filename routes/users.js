// routes/users.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Route Đăng ký người dùng
router.post('/register', async (req, res) => {
    try {
      const { name, email, password, role } = req.body;
  
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: 'Email đã tồn tại' });
      }
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      user = new User({ name, email, password: hashedPassword, role });
  
      await user.save();
  
      res.status(201).json({ msg: 'Đăng ký thành công' });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: err.message || 'Lỗi server' });
    }
  });
  

module.exports = router;
