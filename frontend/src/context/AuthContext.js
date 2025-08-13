import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

// Get backend base URL from environment
const API = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

// Create the context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  const login = (userData, token) => {
    setUser(userData);
    setToken(token);
    localStorage.setItem("token", token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  const refreshUser = async () => {
    if (!token) return;
    
    try {
      const res = await axios.get(`${API}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (err) {
      console.error('Error refreshing user data:', err);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${API}/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
          } catch (err) {
      logout();
    } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Named export
export const useAuth = () => useContext(AuthContext);
