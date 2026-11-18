import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api, { errMsg } from "../api";
import { useAuth } from "../context/AuthContext";

export default function AuthForm({ mode, role }) {
  const isRegister = mode === "register";
  const isAdmin = role === "admin";
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "", confirmPassword: "" });
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (isRegister && form.password !== form.confirmPassword) return toast.error("Passwords do not match");
    setBusy(true);
    try {
      const base = isAdmin ? "/admin" : "/auth";
      const { data } = await api.post(`${base}/${mode}`, form);
      login(data.token, data.account);
      toast.success(isRegister ? "Account created" : "Welcome back");
      navigate(isAdmin ? "/admin" : "/home");
    } catch (err) {
      toast.error(errMsg(err));
    } finally {
      setBusy(false);
    }
  };

  const type = show ? "text" : "password";
  const prefix = isAdmin ? "/admin" : "";

  return (
    <div className="auth-wrap">
      <form className="auth-card" onSubmit={submit}>
        <Link to="/" className="logo center"><span>i</span>Movies</Link>
        <h2>{isAdmin ? "Admin " : ""}{isRegister ? "Register" : "Login"}</h2>

        {isRegister && (
          <label>Username
            <input value={form.username} onChange={set("username")} placeholder="Enter Username" required minLength={3} maxLength={20} />
          </label>
        )}
        <label>Email
          <input type="email" value={form.email} onChange={set("email")} placeholder="Enter your email" required />
        </label>
        <label>Password
          <input type={type} value={form.password} onChange={set("password")} placeholder="Enter your password" required minLength={isRegister ? 8 : undefined} />
        </label>
        {isRegister && (
          <label>Confirm Password
            <input type={type} value={form.confirmPassword} onChange={set("confirmPassword")} placeholder="Confirm your password" required />
          </label>
        )}
        <label className="check">
          <input type="checkbox" checked={show} onChange={(e) => setShow(e.target.checked)} /> Show Password
        </label>

        <button className="btn" disabled={busy}>{busy ? "Please wait..." : "Submit"}</button>

        <p className="alt">
          {isRegister ? "Already have an account?" : "Create an account"}{" "}
          <Link to={`${prefix}/${isRegister ? "login" : "register"}`}>{isRegister ? "Login" : "Register"}</Link>
        </p>
        {isRegister && !isAdmin && (
          <p className="alt">Register as an <Link to="/admin/register">Admin</Link></p>
        )}
        {isAdmin && <p className="alt">Not an admin? <Link to="/login">User login</Link></p>}
      </form>
    </div>
  );
}
