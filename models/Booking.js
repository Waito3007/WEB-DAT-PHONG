const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  room: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
  bookingDate: { type: Date, default: Date.now },
  checkInDate: { type: Date, required: true },
  checkOutDate: { type: Date, required: true },
  phoneBooking: { type: String, required: true },
  emailBooking: { type: String, required: true },
  paymentStatus: {
    type: String,
    enum: ["Pending", "Complete", "CheckIn", "Done"],
    default: "Pending",
  },
  orderId: { type: String, required: true },
  priceBooking: { type: Number, required: true },
});



module.exports = mongoose.model("Booking", BookingSchema);
