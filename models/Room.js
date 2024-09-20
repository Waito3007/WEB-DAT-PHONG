const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
  type: { type: String, required: true }, // ví dụ: 'Deluxe', 'Standard'
  price: { type: Number, required: true },
  availability: { type: Boolean, default: true },
});

module.exports = mongoose.model('Room', roomSchema);
