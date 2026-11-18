const pad = (n) => String(n).padStart(2, "0");

exports.nowParts = () => {
  const d = new Date();
  return {
    date: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
    time: `${pad(d.getHours())}:${pad(d.getMinutes())}`,
  };
};

exports.isPast = (date, time) => {
  const n = exports.nowParts();
  return date < n.date || (date === n.date && time <= n.time);
};

exports.DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
exports.TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;
