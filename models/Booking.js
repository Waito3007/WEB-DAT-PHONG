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

// Middleware hoàn lại phòng khi cập nhật trạng thái đơn hàng thành 'Done'
BookingSchema.post("findOneAndUpdate", async function (doc, next) {
  if (doc.paymentStatus === "Done") {
    const room = await mongoose.model("Room").findById(doc.room);
    if (room) {
      room.remainingRooms += 1;
      await room.save();
    }
  }
  next();
});

module.exports = mongoose.model("Booking", BookingSchema);
