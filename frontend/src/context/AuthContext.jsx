import { createContext, useContext, useState, useCallback } from 'react';
import { getToken, setToken, clearToken, getAdmin, setAdmin as saveAdmin } from '../lib/auth.js';
import { loginAdmin } from '../lib/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() => getToken());
  const [admin, setAdminState] = useState(() => getAdmin());

  const login = useCallback(async (email, password) => {
    const data = await loginAdmin(email, password);
    setToken(data.token);
    saveAdmin(data.admin);
    setTokenState(data.token);
    setAdminState(data.admin);
    return data;
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setTokenState(null);
    setAdminState(null);
  }, []);

  return (
    <AuthContext.Provider value={{ token, admin, isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
