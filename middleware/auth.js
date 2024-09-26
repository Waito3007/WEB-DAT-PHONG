const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.cookies.token; // Kiểm tra token trong cookie

  if (!token) {
    return res.status(401).json({ msg: 'Không có token, xác thực bị từ chối' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // Lưu thông tin user vào request
    next();
  } catch (err) {
    return res.status(400).json({ msg: 'Token không hợp lệ' });
  }
};

module.exports = auth;
