
"use client";
import LoadingScreen from "@/components/LoadingScreen";
import axios from "axios";
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();
const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get(`${backendURL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(res => {
          setUserData(res.data);
        })
        .catch(() => {
          localStorage.removeItem("token");
        })
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await axios.post(
        `${backendURL}/api/auth/login`,
        {
          email,
          password,
        }
      );

      localStorage.setItem("token", data.token);
      setUserData(data.user);
      return data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  };

  const signup = async (email, password, confirmPassword) => {
    try {
      const { data } = await axios.post(
        `${backendURL}/api/auth/signup`,
        {
          email,
          password,
          confirmPassword,
        }
      );
      localStorage.setItem("token", data.token);
      setUserData(data.user);
      return data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUserData(null);
  };

  if (loading) return <LoadingScreen />
  return (
    <AuthContext.Provider value={{ userData, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
