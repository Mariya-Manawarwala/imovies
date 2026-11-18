import { Routes, Route, Navigate } from "react-router-dom";
import RequireRole from "./components/RequireRole";
import Landing from "./pages/Landing";
import AuthForm from "./components/AuthForm";
import Home from "./pages/Home";
import MovieDetails from "./pages/MovieDetails";
import SeatsPage from "./pages/SeatsPage";
import Favorites from "./pages/Favorites";
import Profile from "./pages/Profile";
import Bookings from "./pages/Bookings";
import AdminMovies from "./pages/AdminMovies";
import AddMovie from "./pages/AddMovie";
import AddShow from "./pages/AddShow";
import AddTheatre from "./pages/AddTheatre";
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<AuthForm mode="login" role="user" />} />
      <Route path="/register" element={<AuthForm mode="register" role="user" />} />
      <Route path="/admin/login" element={<AuthForm mode="login" role="admin" />} />
      <Route path="/admin/register" element={<AuthForm mode="register" role="admin" />} />

      <Route element={<RequireRole role="user" />}>
        <Route path="/home" element={<Home />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/seats/:showId" element={<SeatsPage />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/bookings" element={<Bookings />} />
      </Route>

      <Route element={<RequireRole role="admin" />}>
        <Route path="/admin" element={<AdminMovies />} />
        <Route path="/admin/add-movie" element={<AddMovie />} />
        <Route path="/admin/add-show" element={<AddShow />} />
        <Route path="/admin/add-theatre" element={<AddTheatre />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
