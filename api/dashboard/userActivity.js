// userActivity.js ( tạm chưa có )
const express = require('express');
const router = express.Router();
const UserActivity = require('../../models/UserActivity'); // Mô hình MongoDB của bạn

router.get('/', async (req, res) => {
    try {
        const activities = await UserActivity.find();
        res.json(activities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
