/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('sm_token'));
  const [admin, setAdmin] = useState(() => {
    try { return JSON.parse(localStorage.getItem('sm_admin')); } catch { return null; }
  });

  const login = (token, adminData) => {
    localStorage.setItem('sm_token', token);
    localStorage.setItem('sm_admin', JSON.stringify(adminData));
    setToken(token);
    setAdmin(adminData);
  };

  const logout = () => {
    localStorage.removeItem('sm_token');
    localStorage.removeItem('sm_admin');
    setToken(null);
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ token, admin, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
