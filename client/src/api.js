import axios from "axios";
import Cookies from "js-cookie";
import dayjs from "dayjs";

const api = axios.create({ baseURL: "/api" });

api.interceptors.request.use((cfg) => {
  const token = Cookies.get("token");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export const errMsg = (e) => e?.response?.data?.message || e.message || "Something went wrong";
export const fmtDate = (d) => dayjs(d).format("MMM D, YYYY");
export const fmt12 = (t) => dayjs(`2000-01-01T${t}`).format("h:mm A"); // admin side
export const TIERS = [
  ["balcony", "Balcony"],
  ["middle", "Middle"],
  ["lower", "Lower"],
];

export default api;
