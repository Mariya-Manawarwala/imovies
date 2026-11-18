const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    reference: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    show: { type: mongoose.Schema.Types.ObjectId, ref: "Show" },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
    amount: { type: Number, required: true },
    method: { type: String, enum: ["card", "upi", "netbanking"], required: true },
    status: { type: String, enum: ["success", "failed"], required: true },
    failureReason: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
