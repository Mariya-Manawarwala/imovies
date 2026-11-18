import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api, { errMsg } from "../api";

export default function AddShow() {
  const navigate = useNavigate();
  const [theatres, setTheatres] = useState([]);
  const [movies, setMovies] = useState([]);
  const [f, setF] = useState({ theatreId: "", movieId: "", showDate: "", showTime: "" });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  useEffect(() => {
    api.get("/theatres").then((r) => setTheatres(r.data.theatres));
    api.get("/movies").then((r) => setMovies(r.data.movies));
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/shows", f);
      toast.success("Show added");
      navigate("/admin/dashboard");
    } catch (err) { toast.error(errMsg(err)); }
  };

  return (
    <>
      <h1 className="title">Add <span>Show</span></h1>
      <form className="panel narrow form-col" onSubmit={submit}>
        <label>Theatres
          <select value={f.theatreId} onChange={set("theatreId")} required>
            <option value="">Select Theatre</option>
            {theatres.map((t) => <option key={t._id} value={t._id}>{t.theatreName} ({t.location})</option>)}
          </select>
        </label>
        <label>Movies
          <select value={f.movieId} onChange={set("movieId")} required>
            <option value="">Select Movie</option>
            {movies.map((m) => <option key={m._id} value={m._id}>{m.movieName}</option>)}
          </select>
        </label>
        <label>Show Date<input type="date" value={f.showDate} onChange={set("showDate")} required /></label>
        <label>Showtime<input type="time" value={f.showTime} onChange={set("showTime")} required /></label>
        <div className="row center"><button className="btn">Submit</button></div>
      </form>
    </>
  );
}
