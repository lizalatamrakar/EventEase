// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getSession, login as svcLogin, register as svcRegister, logout as svcLogout } from '../services/authService.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = getSession();
    setUser(session || null);
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    const result = svcLogin(email, password);
    if (result.success) setUser(result.user);
    return result;
  }, []);

  const register = useCallback(async (data) => {
    const result = svcRegister(data);
    if (result.success) setUser(result.user);
    return result;
  }, []);

  const logout = useCallback(() => {
    svcLogout();
    setUser(null);
  }, []);

  const refreshUser = useCallback(() => {
    const session = getSession();
    setUser(session || null);
  }, []);

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
