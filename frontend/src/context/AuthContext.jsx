import { createContext, useContext, useMemo, useState } from "react";
import { authApi } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    const storedToken = localStorage.getItem("ttm_token");
    return storedToken?.startsWith("demo-") ? null : storedToken;
  });
  const [user, setUser] = useState(() => {
    const storedToken = localStorage.getItem("ttm_token");
    if (storedToken?.startsWith("demo-")) {
      localStorage.removeItem("ttm_token");
      localStorage.removeItem("ttm_user");
      return null;
    }

    const stored = localStorage.getItem("ttm_user");
    return stored ? JSON.parse(stored) : null;
  });

  const persistSession = (payload) => {
    localStorage.setItem("ttm_token", payload.token);
    localStorage.setItem("ttm_user", JSON.stringify(payload.user));
    setToken(payload.token);
    setUser(payload.user);
  };

  const login = async (payload) => {
    const session = await authApi.login(payload);
    persistSession(session);
  };

  const signup = async (payload) => {
    const session = await authApi.signup(payload);
    persistSession(session);
  };

  const logout = () => {
    localStorage.removeItem("ttm_token");
    localStorage.removeItem("ttm_user");
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({ token, user, login, signup, logout, isAuthenticated: Boolean(user && token) }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
