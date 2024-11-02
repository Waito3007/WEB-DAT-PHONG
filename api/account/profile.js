const express = require('express');
const router = express.Router();
const User = require('../../models/User'); // Điều chỉnh đường dẫn nếu cần
const jwt = require('jsonwebtoken');
const multer = require('multer');
const cookieParser = require('cookie-parser');
const auth = require('../../middleware/auth');
const upload = require('../../middleware/upload');
const cloudinary = require('cloudinary').v2;
// Sử dụng cookie-parser
router.use(cookieParser());


// Hàm lấy publicId từ URL của Cloudinary
const getPublicIdFromUrl = (url) => {
  const matches = url.match(/\/v\d+\/(.+)\.(jpg|jpeg|png|gif|webp)/);
  return matches ? matches[1] : null;
};

// Cập nhật ảnh đại diện
router.post('/upload-avatar', auth, upload.single('avatar'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ msg: 'Không có file nào được tải lên.' });
  }

  try {
    const imageUrl = req.file.path; // Sử dụng path để lấy URL từ req.file
    const userId = req.userId; // Lấy ID người dùng từ middleware

    // Lấy thông tin người dùng hiện tại
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'Người dùng không tìm thấy.' });
    }

    // Nếu người dùng đã có avatar, xóa ảnh cũ trên Cloudinary
    if (user.avatar) {
      const publicId = getPublicIdFromUrl(user.avatar);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId); // Xóa ảnh cũ
      }
    }

    // Cập nhật avatar mới vào cơ sở dữ liệu
    await updateUserAvatar(userId, { imageUrl: imageUrl });

    res.status(200).json({ msg: 'Tải lên thành công', imageUrl: imageUrl });
  } catch (error) {
    console.error('Lỗi tải lên:', error);
    res.status(500).json({ msg: 'Lỗi server', error: error.message });
  }
});

const updateUserAvatar = async (userId, { imageUrl }) => {
  try {
    await User.findByIdAndUpdate(userId, { avatar: imageUrl }, { new: true }); // Chắc chắn rằng bạn cập nhật đúng trường
  } catch (error) {
    throw new Error('Lỗi khi cập nhật avatar');
  }
};




// Route Lấy thông tin người dùng
router.get('/me',auth, async (req, res) => {
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

// API chỉnh sửa hồ sơ người dùng
router.patch('/edit', auth, async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ msg: 'Không tìm thấy token' });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  try {
    const updatedUser = await User.findByIdAndUpdate(decoded.userId, req.body, { new: true, runValidators: true }).select('-password');
    if (!updatedUser) {
      return res.status(404).json({ msg: 'Người dùng không tồn tại' });
    }
    res.json(updatedUser);
  } catch (err) {
    console.error("Lỗi cập nhật hồ sơ:", err.message);
    res.status(500).json({ msg: 'Lỗi server' });
  }
});

// API để thay đổi mật khẩu
router.patch('/change-password', auth, async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ msg: 'Không tìm thấy token' });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ msg: 'Người dùng không tồn tại' });
    }

    // Kiểm tra mật khẩu hiện tại
    const isMatch = await user.comparePassword(currentPassword); // Giả sử bạn có phương thức này trong model User
    if (!isMatch) {
      return res.status(400).json({ msg: 'Mật khẩu hiện tại không đúng' });
    }

    // Cập nhật mật khẩu mới
    user.password = newPassword; // Giả sử bạn đã mã hóa mật khẩu trong model
    await user.save();

    res.json({ msg: 'Đổi mật khẩu thành công' });
  } catch (err) {
    console.error("Lỗi thay đổi mật khẩu:", err.message);
    res.status(500).json({ msg: 'Lỗi server' });
  }
});

// API để đăng xuất
router.post('/logout', (req, res) => {
  res.clearCookie('token'); // Xóa cookie token
  res.json({ msg: 'Đăng xuất thành công' });
});

module.exports = router;
