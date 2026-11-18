const User = require("../models/User");
const Admin = require("../models/Admin");
const { verify } = require("../utils/token");

// auth()        -> any logged-in account
// auth("user")  -> users only,  auth("admin") -> admins only
module.exports = (role) => async (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return res.status(401).json({ message: "Please log in" });
    const payload = verify(token);
    if (role && payload.role !== role) return res.status(403).json({ message: "Not allowed" });
    const Model = payload.role === "admin" ? Admin : User;
    const account = await Model.findById(payload.id).select("-password");
    if (!account) return res.status(401).json({ message: "Account not found" });
    req.account = account;
    req.role = payload.role;
    next();
  } catch (err) {
    res.status(401).json({ message: "Session expired. Please log in again" });
  }
};
