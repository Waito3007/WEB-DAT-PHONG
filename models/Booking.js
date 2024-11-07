const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  bookingDate: { type: Date, default: Date.now },
  checkInDate: { type: Date, required: true },
  checkOutDate: { type: Date, required: true },
  phoneBooking: { type: String, required: true },
  emailBooking: { type: String, required: true },
  paymentStatus: { type: String, enum: ['Pending', 'Complete','CheckIn','CheckOut'], default: 'Pending' },
  orderId: { type: String, required: true }, // Thêm trường orderId
});

module.exports = mongoose.model('Booking', BookingSchema);
