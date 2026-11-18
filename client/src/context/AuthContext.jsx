import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import api from "../api";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(!!Cookies.get("token"));

  useEffect(() => {
    if (!Cookies.get("token")) return;
    api
      .get("/auth/me")
      .then((r) => setAccount(r.data.account))
      .catch(() => Cookies.remove("token"))
      .finally(() => setLoading(false));
  }, []);

  const login = (token, acc) => {
    Cookies.set("token", token, { expires: 7 });
    setAccount(acc);
  };
  const logout = () => {
    Cookies.remove("token");
    setAccount(null);
  };

  return (
    <AuthContext.Provider value={{ account, role: account?.role || null, loading, login, logout, setAccount }}>
      {children}
    </AuthContext.Provider>
  );
}
