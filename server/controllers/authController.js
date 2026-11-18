const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Admin = require("../models/Admin");
const { sign } = require("../utils/token");
const httpError = require("../utils/httpError");
const wrap = require("../utils/wrap");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const shape = (a, role) => ({ id: a._id, username: a.username, email: a.email, role });

const factory = (Model, role) => ({
  register: wrap(async (req, res) => {
    const { username = "", email = "", password = "", confirmPassword } = req.body;
    const name = username.trim();
    if (name.length < 3 || name.length > 20) throw httpError(400, "Username must be 3 to 20 characters");
    if (!EMAIL_RE.test(email.trim()) || email.length > 50) throw httpError(400, "Enter a valid email");
    if (password.length < 8) throw httpError(400, "Password must be at least 8 characters");
    if (password !== confirmPassword) throw httpError(400, "Passwords do not match");
    const mail = email.trim().toLowerCase();
    if (await Model.findOne({ $or: [{ email: mail }, { username: name }] }))
      throw httpError(409, "Username or email is already registered");
    const doc = await Model.create({ username: name, email: mail, password: await bcrypt.hash(password, 10) });
    res.status(201).json({ token: sign(doc._id, role), account: shape(doc, role) });
  }),

  login: wrap(async (req, res) => {
    const { email = "", password = "" } = req.body;
    const doc = await Model.findOne({ email: email.trim().toLowerCase() });
    if (!doc || !(await bcrypt.compare(password, doc.password))) throw httpError(401, "Invalid email or password");
    res.json({ token: sign(doc._id, role), account: shape(doc, role) });
  }),
});

exports.userAuth = factory(User, "user");
exports.adminAuth = factory(Admin, "admin");

exports.me = (req, res) => res.json({ account: shape(req.account, req.role) });

exports.updateMe = wrap(async (req, res) => {
  const Model = req.role === "admin" ? Admin : User;
  const doc = await Model.findById(req.account._id);
  const { username, currentPassword, newPassword } = req.body;
  if (username !== undefined) {
    const name = username.trim();
    if (name.length < 3 || name.length > 20) throw httpError(400, "Username must be 3 to 20 characters");
    doc.username = name;
  }
  if (newPassword) {
    if (newPassword.length < 8) throw httpError(400, "New password must be at least 8 characters");
    if (!(await bcrypt.compare(currentPassword || "", doc.password))) throw httpError(400, "Current password is incorrect");
    doc.password = await bcrypt.hash(newPassword, 10);
  }
  await doc.save();
  res.json({ account: shape(doc, req.role) });
});
