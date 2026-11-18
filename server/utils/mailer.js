const nodemailer = require("nodemailer");

let transporter = null;
if (process.env.SMTP_HOST) {
  const port = Number(process.env.SMTP_PORT || 587);
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

exports.sendMail = async ({ to, subject, text }) => {
  if (!transporter) return; // SMTP not configured: skip silently
  await transporter.sendMail({ from: process.env.MAIL_FROM || process.env.SMTP_USER, to, subject, text });
};

const seatText = (s) =>
  ["balcony", "middle", "lower"]
    .filter((t) => s[t] && s[t].length)
    .map((t) => `${t[0].toUpperCase() + t.slice(1)} seats: ${s[t].join(", ")}`)
    .join("\n");

exports.sendBookingEmail = (booking) =>
  exports.sendMail({
    to: booking.userEmail,
    subject: `iMovies booking confirmed - ${booking.movieName}`,
    text:
      `Your booking ${booking.bookingCode} is confirmed.\n\n` +
      `Movie: ${booking.movieName}\nTheatre: ${booking.theatreName}\n` +
      `Date: ${booking.showDate}\nTime: ${booking.showTime}\n${seatText(booking.seats)}\n` +
      `Total: ${booking.totalPrice} INR\n\nEnjoy the show!`,
  });
