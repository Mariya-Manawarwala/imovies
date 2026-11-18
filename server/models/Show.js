const mongoose = require("mongoose");

const showSchema = new mongoose.Schema(
  {
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },
    movie: { type: mongoose.Schema.Types.ObjectId, ref: "Movie", required: true },
    theatre: { type: mongoose.Schema.Types.ObjectId, ref: "Theatre", required: true },
    showDate: { type: String, required: true }, // YYYY-MM-DD
    showTime: { type: String, required: true }, // HH:mm (24-hour)
    bookedSeats: {
      balcony: { type: [Number], default: [] },
      middle: { type: [Number], default: [] },
      lower: { type: [Number], default: [] },
    },
  },
  { timestamps: true }
);

// one screening per theatre at a given date and time
showSchema.index({ theatre: 1, showDate: 1, showTime: 1 }, { unique: true });

module.exports = mongoose.model("Show", showSchema);
