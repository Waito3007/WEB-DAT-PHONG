const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  // Lấy token từ cookie hoặc Authorization header
  let token = req.cookies.token;
  
  // Nếu không có token trong cookie, kiểm tra Authorization header
  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7); // Loại bỏ "Bearer " prefix
    }
  }
  
  // Kiểm tra xem token có tồn tại không
  if (!token) {
    console.log("Token không tồn tại.");
    return res.status(401).json({ msg: 'Chưa xác thực, vui lòng đăng nhập' });
  }
  
  try {
    // Xác thực token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId; // Lưu userId vào request để sử dụng trong các route khác
    next(); // Cho phép tiếp tục đến route tiếp theo
  } catch (err) {
    console.log("Token verification failed:", err.message);
    return res.status(403).json({ msg: 'Token không hợp lệ' });
  }
};

module.exports = auth;
