const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');

// Route to get user profile
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

const fetchUserInfo = async () => {
  try {
    const response = await axios.get('/api/profile/me', {
      withCredentials: true, // Nếu cần gửi cookie để xác thực
    });
    if (response.data && response.data.role) {
      setIsAdmin(response.data.role === 'Admin');
    }
  } catch (error) {
    console.error('Lỗi khi lấy thông tin người dùng:', error);
  }
};



module.exports = router;