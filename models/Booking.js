// models/Booking.js
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  bookingDate: { type: Date, required: true },
  checkInDate: { type: Date, required: true },
  checkOutDate: { type: Date, required: true },
  paymentStatus: { type: String, enum: ['Pending', 'Completed', 'Cancelled'], default: 'Pending' },
});

module.exports = mongoose.model('Booking', bookingSchema);
