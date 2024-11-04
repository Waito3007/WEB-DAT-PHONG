const express = require('express');
const router = express.Router();
const User = require('../../models/User'); // Điều chỉnh đường dẫn nếu cần
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
// Sử dụng cookie-parser
router.use(cookieParser());

// Route Lấy thông tin người dùng
router.get('/me', async (req, res) => {
  try {
    // Lấy token từ cookie
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ msg: 'Không tìm thấy token' });
    }

    // Xác thực token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password'); // Lấy thông tin người dùng trừ mật khẩu
    if (!user) {
      return res.status(404).json({ msg: 'Người dùng không tồn tại' });
    }

    // Trả về thông tin người dùng
    res.json(user);
  } catch (err) {
    console.error("Lỗi xác thực:", err.message);
    res.status(500).json({ msg: 'Lỗi server' });
  }
});
// API để đăng xuất
router.post('/logout', (req, res) => {
  // Xóa cookie chứa token
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Đảm bảo secure flag khi ở production
    sameSite: 'strict', 
  });

  // Trả về phản hồi thành công
  res.status(200).json({ msg: 'Đăng xuất thành công' });
});
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    // Tìm người dùng với email được cung cấp
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: 'Email không tồn tại trong hệ thống' });
    }

    // Tạo token đặt lại mật khẩu
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // Token có hiệu lực trong 1 giờ
    await user.save();

    // Tạo transporter để gửi email
    const transporter = nodemailer.createTransport({
      service: 'Gmail', // hoặc một dịch vụ email khác
      auth: {
        user: 'minhnguyen11234321@gmail.com',
        pass: 'joddlkxcfnuabcpi', // Mật khẩu ứng dụng
      },
    });

    // Nội dung email
    const mailOptions = {
      from: 'minhnguyen11234321@gmail.com',
      to: email,
      subject: 'Đặt lại mật khẩu',
      text: `Vui lòng nhấn vào liên kết sau để đặt lại mật khẩu của bạn: \n\n
             http://localhost:3000/ResetPassword/${resetToken} \n\n
             Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.`,
    };

    // Gửi email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Lỗi gửi email:', error);
        return res.status(500).json({ msg: 'Không thể gửi email đặt lại mật khẩu' });
      } else {
        res.status(200).json({ msg: 'Liên kết đặt lại mật khẩu đã được gửi đến email của bạn' });
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Đã xảy ra lỗi, vui lòng thử lại sau' });
  }
});

// API đặt lại mật khẩu
router.post('/reset', async (req, res) => {
  const { token, newPassword } = req.body;

  // Log token ra console để kiểm tra
  console.log('Received token:', token);

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() } // Kiểm tra token còn hiệu lực
    });

    if (!user) {
      return res.status(400).json({ msg: 'Token không hợp lệ hoặc đã hết hạn.' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = Date.now() + 240; // Token có hiệu lực trong 1 giờ
    await user.save();
    res.status(200).json({ msg: 'Đặt lại mật khẩu thành công.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Lỗi server' });
  }
});


module.exports = router;
