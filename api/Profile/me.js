const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth"); // Middleware để xác thực

// GET /api/profile/me
router.get("/me", auth, async (req, res) => {
  try {
    // Giả sử bạn đã có một hàm lấy user
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
