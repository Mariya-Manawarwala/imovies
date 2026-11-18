import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api, { errMsg } from "../api";

export default function AddMovie() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [f, setF] = useState({ movieName: "", description: "", genres: "", releaseDate: "", runtime: "", certification: "", trailerUrl: "" });
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const pick = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Upload a poster image");
    const body = new FormData();
    Object.entries(f).forEach(([k, v]) => body.append(k, v));
    body.append("poster", file);
    setBusy(true);
    try {
      await api.post("/movies", body);
      toast.success("Movie added");
      navigate("/admin");
    } catch (err) { toast.error(errMsg(err)); }
    finally { setBusy(false); }
  };

  return (
    <form className="narrow" onSubmit={submit}>
      <label className="poster-upload">
        {preview ? <img src={preview} alt="Poster preview" /> : <span>Click to upload poster (JPG, PNG, WEBP, max 5 MB)</span>}
        <input type="file" accept="image/jpeg,image/png,image/webp" onChange={pick} hidden />
      </label>
      <h1 className="title">Add <span>Movie</span></h1>
      <div className="form-grid">
        <label>Movie<input value={f.movieName} onChange={set("movieName")} placeholder="Enter movie name" required /></label>
        <label>Description<input value={f.description} onChange={set("description")} placeholder="Enter movie description" required minLength={10} /></label>
        <label>Genres<input value={f.genres} onChange={set("genres")} placeholder="Enter movie genres separated by commas" required /></label>
        <label>Release Date<input type="date" value={f.releaseDate} onChange={set("releaseDate")} required /></label>
        <label>Runtime (minutes)<input type="number" min="1" value={f.runtime} onChange={set("runtime")} placeholder="Enter runtime in minutes" required /></label>
        <label>Certification<input value={f.certification} onChange={set("certification")} placeholder="Enter movie certification" required /></label>
        <label>Trailer URL (YouTube)<input value={f.trailerUrl} onChange={set("trailerUrl")} placeholder="https://www.youtube.com/watch?v=..." /></label>
      </div>
      <div className="row center"><button className="btn" disabled={busy}>{busy ? "Uploading..." : "Submit"}</button></div>
    </form>
  );
}
