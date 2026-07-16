import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);

const API = "http://localhost:8000/api/auth";

// Configure axios to send cookies
axios.defaults.withCredentials = true;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await axios.get(`${API}/me`);
      setUser(res.data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    const res = await axios.post(`${API}/register`, { name, email, password });
    setUser(res.data.user);
    return res.data;
  };

  const login = async (email, password) => {
    const res = await axios.post(`${API}/login`, { email, password });
    setUser(res.data.user);
    return res.data;
  };

  const logout = async () => {
    await axios.post(`${API}/logout`);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
