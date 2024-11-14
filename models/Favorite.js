const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  hotelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
  createdAt: { type: Date, default: Date.now } // Ngày đánh dấu yêu thích
});

module.exports = mongoose.model('Favorite', favoriteSchema);
