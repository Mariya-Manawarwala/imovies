const jwt = require("jsonwebtoken");

const secret = () => process.env.JWT_SECRET || "dev-only-secret";

exports.sign = (id, role) => jwt.sign({ id, role }, secret(), { expiresIn: "7d" });
exports.verify = (token) => jwt.verify(token, secret());
