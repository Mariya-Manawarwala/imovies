require("dotenv").config();
const dns = require("dns");
// Prefer IPv4 so "localhost" does not resolve to ::1 for a local MongoDB
if (dns.setDefaultResultOrder) dns.setDefaultResultOrder("ipv4first");

const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const { startReminderJob } = require("./utils/reminderService");

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/movies", require("./routes/movieRoutes"));
app.use("/api/theatres", require("./routes/theatreRoutes"));
app.use("/api/shows", require("./routes/showRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/payments", require("./routes/paymentRoutes"));
app.use("/api/favorites", require("./routes/favoriteRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));

app.use((req, res) => res.status(404).json({ message: "Route not found" }));
app.use(errorHandler);

const PORT = process.env.PORT || 8000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
  startReminderJob();
});
