const mongoose = require("mongoose");

const num = { type: Number, required: true, min: 0 };

const theatreSchema = new mongoose.Schema(
  {
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },
    theatreName: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    balconySeatPrice: num,
    middleSeatPrice: num,
    lowerSeatPrice: num,
    balconySeats: num, // number of seats, numbered 1..N within the tier
    middleSeats: num,
    lowerSeats: num,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Theatre", theatreSchema);
