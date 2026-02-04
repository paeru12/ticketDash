import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

const MOCK_USERS = {
  SUPERADMIN: { email: 'superadmin@tiketku.id', password: 'superadmin' },
  EVENT_ADMIN: { email: 'eventadmin@tiketku.id', password: 'eventadmin' },
  SCAN_STAFF: { email: 'scanstaff@tiketku.id', password: 'scanstaff' },
};

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
      const raw = localStorage.getItem('tiketku_auth');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
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
    if (!email || !password) {
      throw new Error('Email dan password wajib diisi');
    }

    const lowerEmail = email.toLowerCase();

    if (lowerEmail === MOCK_USERS.SUPERADMIN.email && password === MOCK_USERS.SUPERADMIN.password) {
      return persistUser({
        email,
        role: 'SUPERADMIN',
        name: 'Super Admin',
      });
    }

    if (lowerEmail === MOCK_USERS.EVENT_ADMIN.email && password === MOCK_USERS.EVENT_ADMIN.password) {
      return persistUser({
        email,
        role: 'EVENT_ADMIN',
        name: 'Event Admin',
      });
    }

    if (lowerEmail === MOCK_USERS.SCAN_STAFF.email && password === MOCK_USERS.SCAN_STAFF.password) {
      return persistUser({
        email,
        role: 'SCAN_STAFF',
        name: 'Scan Staff',
        assignedEvents: [], // nanti dari API
      });
    }

    // broadcast ke tab lain
    window.dispatchEvent(new Event("auth:logout"));
  };

  const persistUser = (u) => {
    setUser(u);
    localStorage.setItem('tiketku_auth', JSON.stringify(u));
    return u;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('tiketku_auth');
  };

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
