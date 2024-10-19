const express = require("express");
const router = express.Router();
const User = require("../../models/User"); // Điều chỉnh đường dẫn nếu cần
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

// Sử dụng cookie-parser
router.use(cookieParser());

// Route Lấy thông tin người dùng
router.get("/me", async (req, res) => {
  try {
    // Lấy token từ cookie
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ msg: "Không tìm thấy token" });
    }

    // Xác thực token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password"); // Lấy thông tin người dùng trừ mật khẩu
    if (!user) {
      return res.status(404).json({ msg: "Người dùng không tồn tại" });
    }

    // Trả về thông tin người dùng
    res.json(user);
  } catch (err) {
    console.error("Lỗi xác thực:", err.message);
    res.status(500).json({ msg: "Lỗi server" });
  }
});

const fetchUserInfo = async () => {
  try {
    const response = await axios.get("/api/profile/me", {
      withCredentials: true, // Nếu cần gửi cookie để xác thực
    });
    if (response.data && response.data.role) {
      setIsAdmin(response.data.role === "Admin");
    }
  } catch (error) {
    console.error("Lỗi khi lấy thông tin người dùng:", error);
  }
};

module.exports = router;
