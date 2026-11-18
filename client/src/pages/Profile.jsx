import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api, { errMsg } from "../api";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { account, setAccount, logout } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState(account.username);
  const [currentPassword, setCurrent] = useState("");
  const [newPassword, setNew] = useState("");

  const save = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.put("/auth/me", { username, currentPassword, newPassword });
      setAccount(data.account);
      setCurrent("");
      setNew("");
      toast.success("Profile updated");
    } catch (err) { toast.error(errMsg(err)); }
  };

  return (
    <div className="narrow">
      <h1 className="title">Your <span>Profile</span></h1>
      <form className="panel form-col" onSubmit={save}>
        <label>Email<input value={account.email} disabled /></label>
        <label>Username<input value={username} onChange={(e) => setUsername(e.target.value)} minLength={3} maxLength={20} required /></label>
        <label>Current password<input type="password" value={currentPassword} onChange={(e) => setCurrent(e.target.value)} /></label>
        <label>New password<input type="password" value={newPassword} onChange={(e) => setNew(e.target.value)} minLength={8} /></label>
        <div className="row">
          <button className="btn">Save changes</button>
          <button type="button" className="btn outline" onClick={() => { logout(); navigate("/"); }}>Log out</button>
        </div>
      </form>
    </div>
  );
}
