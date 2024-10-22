const express = require('express');
const router = express.Router();
const User = require('../../models/User');

// Route lấy danh sách người dùng
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route xóa người dùng
router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        res.json({ message: 'Người dùng đã được xóa' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route cập nhật người dùng
router.put('/:id', async (req, res) => {
    const { name, email, role } = req.body;
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });

        user.name = name;
        user.email = email;
        user.role = role;

        await user.save();
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route lấy dữ liệu tăng trưởng người dùng theo tháng
router.get('/growth', async (req, res) => {
    try {
        const users = await User.find();
        const userGrowthData = [];

        const monthCounts = {};

        users.forEach(user => {
            const date = new Date(user.registrationDate);
            const month = date.toLocaleString('default', { month: 'short' });
            if (!monthCounts[month]) {
                monthCounts[month] = 0;
            }
            monthCounts[month]++;
        });

        for (const [month, count] of Object.entries(monthCounts)) {
            userGrowthData.push({ month, users: count });
        }

        userGrowthData.sort((a, b) => new Date(`${a.month} 1, 2024`) - new Date(`${b.month} 1, 2024`));

        res.json(userGrowthData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
