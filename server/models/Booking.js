const mongoose = require("mongoose");

const seatList = { type: [Number], default: [] };

const bookingSchema = new mongoose.Schema(
  {
    bookingCode: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },
    show: { type: mongoose.Schema.Types.ObjectId, ref: "Show" },
    movie: { type: mongoose.Schema.Types.ObjectId, ref: "Movie" },
    payment: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" },
    // snapshot, so history survives if a show or theatre is removed
    userEmail: { type: String, required: true },
    movieName: { type: String, required: true },
    theatreName: { type: String, required: true },
    showDate: { type: String, required: true },
    showTime: { type: String, required: true },
    seats: { balcony: seatList, middle: seatList, lower: seatList },
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: ["confirmed", "cancelled"], default: "confirmed" },
    reminderSent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
