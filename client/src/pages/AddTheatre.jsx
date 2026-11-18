import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api, { errMsg } from "../api";

const fields = [
  ["balconySeatPrice", "Balcony Seat Price"], ["balconySeats", "Balcony Seat Count"],
  ["middleSeatPrice", "Middle Seat Price"], ["middleSeats", "Middle Seat Count"],
  ["lowerSeatPrice", "Lower Seat Price"], ["lowerSeats", "Lower Seat Count"],
];

export default function AddTheatre() {
  const navigate = useNavigate();
  const [f, setF] = useState({ theatreName: "", location: "", balconySeatPrice: 0, balconySeats: 0, middleSeatPrice: 0, middleSeats: 0, lowerSeatPrice: 0, lowerSeats: 0 });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/theatres", f);
      toast.success("Theatre added");
      navigate("/admin/add-show");
    } catch (err) { toast.error(errMsg(err)); }
  };

  return (
    <form className="panel narrow" onSubmit={submit}>
      <h1 className="title">Add <span>Theatre</span></h1>
      <label>Theatre Name<input value={f.theatreName} onChange={set("theatreName")} required /></label>
      <label>Theatre Location<input value={f.location} onChange={set("location")} required /></label>
      <div className="form-grid">
        {fields.map(([k, label]) => (
          <label key={k}>{label}<input type="number" min="0" step="1" value={f[k]} onChange={set(k)} required /></label>
        ))}
      </div>
      <div className="row center"><button className="btn">Submit</button></div>
    </form>
  );
}
