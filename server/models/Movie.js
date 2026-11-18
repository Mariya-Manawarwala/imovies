const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
  {
    movieName: { type: String, required: [true, "Movie name is required"], trim: true, minlength: [2, "Movie name must be at least 2 characters"], maxlength: [200, "Movie name cannot exceed 200 characters"] },
    description: { type: String, required: [true, "Description is required"], trim: true, minlength: [10, "Description must be at least 10 characters"] },
    genres: {
      type: [String],
      validate: { validator: (g) => Array.isArray(g) && g.length > 0, message: "At least one genre is required" },
    },
    releaseDate: { type: Date, required: [true, "Release date is required"] },
    runtime: { type: Number, required: [true, "Runtime is required"], min: [1, "Runtime must be positive"] },
    certification: { type: String, required: [true, "Certification is required"], trim: true },
    trailerUrl: { type: String, trim: true, default: "" },
    poster: { type: String, required: true }, // e.g. /uploads/posters/123.jpg
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Movie", movieSchema);
