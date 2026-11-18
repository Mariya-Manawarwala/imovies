const Theatre = require("../models/Theatre");
const Show = require("../models/Show");
const httpError = require("../utils/httpError");
const wrap = require("../utils/wrap");

exports.list = wrap(async (req, res) => {
  res.json({ theatres: await Theatre.find({ admin: req.account._id }).sort({ theatreName: 1 }) });
});

exports.create = wrap(async (req, res) => {
  const b = req.body;
  const fields = ["balconySeatPrice", "middleSeatPrice", "lowerSeatPrice", "balconySeats", "middleSeats", "lowerSeats"];
  for (const f of fields) {
    const n = Number(b[f]);
    if (!Number.isInteger(n) || n < 0) throw httpError(400, "Prices and seat counts must be whole numbers, 0 or more");
  }
  if (fields.slice(3).every((f) => Number(b[f]) === 0)) throw httpError(400, "A theatre needs at least one seat");
  const theatre = await Theatre.create({
    admin: req.account._id,
    theatreName: b.theatreName,
    location: b.location,
    ...Object.fromEntries(fields.map((f) => [f, Number(b[f])])),
  });
  res.status(201).json({ theatre });
});
