import { Link, NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { FiSun, FiMoon, FiHome, FiHeart, FiUser, FiLogOut, FiPlusCircle, FiInfo } from "react-icons/fi";
import { MdHistory, MdMovieEdit } from "react-icons/md";
import { FaTheaterMasks } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

const Logo = ({ to }) => (
  <Link to={to} className="logo">
    <span>i</span>Movies
  </Link>
);

function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button className="icon-btn" onClick={toggle} aria-label="Toggle theme" title="Toggle theme">
      {theme === "dark" ? <FiSun /> : <FiMoon />}
    </button>
  );
}

const IconLink = ({ to, label, end, children }) => (
  <NavLink to={to} end={end} className="icon-btn" aria-label={label} title={label}>
    {children}
  </NavLink>
);

export function UserNavbar() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  return (
    <nav className="navbar">
      <Logo to="/home" />
      <div className="search">
        <input
          type="text"
          value={params.get("q") || ""}
          onChange={(e) => navigate(`/home${e.target.value ? `?q=${encodeURIComponent(e.target.value)}` : ""}`, { replace: true })}
          aria-label="Search movies"
          placeholder="Search by movie or genre"
        />
        <FiInfo />
      </div>
      <div className="nav-icons">
        <ThemeToggle />
        <IconLink to="/home" label="Home" end><FiHome /></IconLink>
        <IconLink to="/favorites" label="Favorites"><FiHeart /></IconLink>
        <IconLink to="/profile" label="Profile"><FiUser /></IconLink>
      </div>
    </nav>
  );
}

export function AdminNavbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  return (
    <nav className="navbar">
      <Logo to="/admin" />
      <div className="nav-icons">
        <ThemeToggle />
        <IconLink to="/admin" label="Movies" end><FiHome /></IconLink>
        <IconLink to="/admin/add-show" label="Add show"><MdMovieEdit /></IconLink>
        <IconLink to="/admin/add-movie" label="Add movie"><FiPlusCircle /></IconLink>
        <IconLink to="/admin/add-theatre" label="Add theatre"><FaTheaterMasks /></IconLink>
        <IconLink to="/admin/dashboard" label="Shows and bookings"><MdHistory /></IconLink>
        <button className="icon-btn" aria-label="Log out" title="Log out" onClick={() => { logout(); navigate("/admin/login"); }}>
          <FiLogOut />
        </button>
      </div>
    </nav>
  );
}
