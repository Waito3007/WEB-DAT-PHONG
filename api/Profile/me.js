const express = require("express");

const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Middleware để xác thực token (giả lập)
const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.sendStatus(401);

  // Giả lập kiểm tra token (có thể thay thế bằng logic thực tế)
  if (token !== "your_valid_token") {
    return res.sendStatus(403);
  }
  next();
};

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Dữ liệu mẫu để giả lập cơ sở dữ liệu
let userData = {
  name: "Nguyễn Văn A",
  email: "nguyenvana@example.com",
  phoneNumber: "0123456789",
  address: "Hà Nội",
  dateOfBirth: "1990-01-01",
};

// GET /api/profile/me
app.get("/api/Profile/me", authenticateToken, (req, res) => {
  try {
    res.json(userData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// PUT /api/profile/me để cập nhật thông tin người dùng
app.put("/api/Profile/me", authenticateToken, (req, res) => {
  const updates = req.body;

  console.log("Dữ liệu nhận được:", updates);

  // Kiểm tra xem có dữ liệu không
  if (!updates || Object.keys(updates).length === 0) {
    return res.status(400).json({ message: "Không có dữ liệu để cập nhật." });
  }

  // Cập nhật dữ liệu người dùng dựa trên các trường có trong body
  for (const key in updates) {
    if (userData.hasOwnProperty(key)) {
      userData[key] = updates[key];
    }
  }

  // Trả về phản hồi thành công
  res.status(200).json({
    message: "Cập nhật thông tin thành công",
    user: userData,
  });
});

// Bắt đầu server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
