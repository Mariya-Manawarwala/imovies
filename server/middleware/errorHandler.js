module.exports = (err, req, res, next) => { // eslint-disable-line no-unused-vars
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((e) => e.message).join(". ");
    return res.status(400).json({ message });
  }
  if (err.code === 11000) {
    const key = Object.keys(err.keyPattern || {});
    const message = key.includes("showDate")
      ? "A show already exists at that theatre, date and time"
      : `${key.join(", ") || "Value"} already exists`;
    return res.status(409).json({ message });
  }
  if (err.name === "CastError") return res.status(400).json({ message: "Invalid id" });
  if (err.name === "MulterError") return res.status(400).json({ message: err.message });
  const status = err.status || 500;
  if (status === 500) console.error(err);
  res.status(status).json({ message: status === 500 ? "Server error" : err.message });
};
