const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true, minlength: 3, maxlength: 20, unique: true },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 50, unique: true },
    password: { type: String, required: true }, // bcrypt hash
  },
  { timestamps: true }
);

module.exports = mongoose.model("Admin", schema);
