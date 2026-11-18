import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { UserNavbar, AdminNavbar } from "./Navbars";

export default function RequireRole({ role }) {
  const { role: current, loading } = useAuth();
  if (loading) return <div className="center-msg">Loading...</div>;
  if (current !== role) return <Navigate to={role === "admin" ? "/admin/login" : "/login"} replace />;
  return (
    <>
      {role === "admin" ? <AdminNavbar /> : <UserNavbar />}
      <main className="page">
        <Outlet />
      </main>
    </>
  );
}
