import { createContext, useContext, useEffect, useRef, useState } from "react";
import api from "@/lib/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const isFetchingRef = useRef(false);

  /**
   * =========================
   * FETCH CURRENT USER (/me)
   * =========================
   */
  const fetchMe = async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    try {
      const res = await api.get("/auth/admin/me");
      res.data.user.role = res.data.user.roles?.[0];
      setUser(res.data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  };

  /**
   * =========================
   * INITIAL LOAD
   * =========================
   */
  useEffect(() => {
    fetchMe();
    const onLogout = () => setUser(null);
    window.addEventListener("auth:logout", onLogout);
    return () => {
      window.removeEventListener("auth:logout", onLogout);
    };
  }, []);

  /**
   * =========================
   * LOGIN
   * =========================
   */
  const login = async (email, password) => {
    const res = await api.post("/auth/admin/login", {
      email,
      password,
    });
    // backend sudah set cookie

    // Backup: Save token if available (for Bearer auth)
    const token = res.data.token || res.data.accessToken;
    if (token) {
      localStorage.setItem("authToken", token);
    }

    setUser({
      ...res.data.user,
      role: res.data.user.roles?.[0], // ⬅️ NORMALISASI
    });
    return res.data.user;
  };

  /**
   * =========================
   * LOGOUT (SILENT)
   * =========================
   */
  const logout = async () => {
    try {
      await api.post("/auth/admin/logout");
    } catch {
      // ignore error
    }

    setUser(null);
    localStorage.removeItem("authToken");

    // broadcast ke tab lain
    window.dispatchEvent(new Event("auth:logout"));
  };

  /**
   * =========================
   * DERIVED STATE
   * =========================
   */
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        loading,
        refetchMe: fetchMe,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}