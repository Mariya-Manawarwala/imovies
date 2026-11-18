const cron = require("node-cron");
const Booking = require("../models/Booking");
const { sendMail } = require("./mailer");

// Every 30 minutes: email a reminder for shows starting within 24 hours
exports.startReminderJob = () => {
  cron.schedule("*/30 * * * *", async () => {
    try {
      const pending = await Booking.find({ status: "confirmed", reminderSent: false });
      const now = Date.now();
      for (const b of pending) {
        const diff = new Date(`${b.showDate}T${b.showTime}:00`).getTime() - now;
        if (diff > 0 && diff <= 24 * 60 * 60 * 1000) {
          await sendMail({
            to: b.userEmail,
            subject: `Reminder: ${b.movieName} starts soon`,
            text: `${b.movieName} at ${b.theatreName} on ${b.showDate} at ${b.showTime}. Booking ${b.bookingCode}.`,
          });
          b.reminderSent = true;
          await b.save();
        }
      }
    } catch (err) {
      console.error("Reminder job failed:", err.message);
    }
  });
};
