const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String },
  manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rooms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Room' }],
  imagehotel: [{ type: String }],
  stars: { type: Number, min: 1, max: 5, required: false }
});

// Xuất mô hình Hotel
module.exports = mongoose.model('Hotel', hotelSchema);
