const multer = require("multer");
const path = require("path");
const fs = require("fs");
const httpError = require("../utils/httpError");

const dir = path.join(__dirname, "..", "uploads", "posters");
fs.mkdirSync(dir, { recursive: true });

module.exports = multer({
  storage: multer.diskStorage({
    destination: dir,
    filename: (req, file, cb) =>
      cb(null, `${Date.now()}-${Math.round(Math.random() * 1e6)}${path.extname(file.originalname).toLowerCase()}`),
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) =>
    /^image\/(jpeg|png|webp)$/.test(file.mimetype) ? cb(null, true) : cb(httpError(400, "Poster must be a JPG, PNG or WEBP image")),
});
