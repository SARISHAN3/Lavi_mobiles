import { createContext, useContext, useEffect, useState } from "react";

import {
  getToken,
  setToken,
  removeToken,
  getStoredUser,
  setStoredUser,
  removeStoredUser,
} from "../config/auth";

import { get, post } from "../services/api";

import ENDPOINTS from "../config/endpoints";

// =====================================
// CREATE CONTEXT
// =====================================

const AuthContext = createContext(null);

// =====================================
// AUTH PROVIDER
// =====================================

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getStoredUser());

  const [token, setAuthToken] = useState(() => getToken());

  const [loading, setLoading] = useState(true);

  // ===================================
  // CHECK CURRENT USER
  // ===================================

  useEffect(() => {
    const checkAuthentication = async () => {
      const storedToken = getToken();

      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const data = await get(ENDPOINTS.AUTH.ME);

        if (data?.success && data?.user) {
          setUser(data.user);

          setStoredUser(data.user);
        } else {
          handleLogout();
        }
      } catch (error) {
        console.error("Authentication check failed:", error);

        handleLogout();
      } finally {
        setLoading(false);
      }
    };

    checkAuthentication();
  }, []);

  // ===================================
  // REGISTER
  // ===================================

  const register = async (registerData) => {
    try {
      const data = await post(ENDPOINTS.AUTH.REGISTER, registerData);

      if (data?.success && data?.token && data?.user) {
        setToken(data.token);

        setAuthToken(data.token);

        setUser(data.user);

        setStoredUser(data.user);
      }

      return data;
    } catch (error) {
      console.error("Registration error:", error);

      throw error;
    }
  };

  // ===================================
  // LOGIN
  // ===================================

  const login = async (loginData) => {
    try {
      const data = await post(ENDPOINTS.AUTH.LOGIN, loginData);

      if (data?.success && data?.token && data?.user) {
        setToken(data.token);

        setAuthToken(data.token);

        setUser(data.user);

        setStoredUser(data.user);
      }

      return data;
    } catch (error) {
      console.error("Login error:", error);

      throw error;
    }
  };

  // ===================================
  // LOGOUT
  // ===================================

  const handleLogout = () => {
    removeToken();

    removeStoredUser();

    setAuthToken(null);

    setUser(null);
  };

  // ===================================
  // UPDATE USER
  // ===================================

  const updateCurrentUser = (updatedUser) => {
    setUser(updatedUser);

    setStoredUser(updatedUser);
  };

  // ===================================
  // REFRESH USER
  // ===================================

  const refreshUser = async () => {
    try {
      const currentToken = getToken();

      if (!currentToken) {
        return null;
      }

      const data = await get(ENDPOINTS.AUTH.ME);

      if (data?.success && data?.user) {
        setUser(data.user);

        setStoredUser(data.user);

        return data.user;
      }

      return null;
    } catch (error) {
      console.error("Refresh user error:", error);

      return null;
    }
  };

  // ===================================
  // AUTH STATUS
  // ===================================

  const isAuthenticated = Boolean(token && user);

  const isAdmin = user?.role === "admin";

  // ===================================
  // CONTEXT VALUE
  // ===================================

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    isAdmin,

    register,
    login,
    logout: handleLogout,

    updateCurrentUser,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// =====================================
// CUSTOM HOOK
// =====================================

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};

export default AuthContext;
