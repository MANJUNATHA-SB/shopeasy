import { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // On refresh, only the token survives in localStorage — the stored user
    // is a quick display cache, so re-validate it against the server once.
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    authService
      .getCurrentUser()
      .then((data) => setUser((prev) => ({ ...prev, ...data })))
      .catch(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  function persistSession(authResponse) {
    const { token, userId, name, email, role } = authResponse;
    localStorage.setItem('token', token);
    const nextUser = { id: userId, name, email, role };
    localStorage.setItem('user', JSON.stringify(nextUser));
    setUser(nextUser);
  }

  async function login(credentials) {
    const data = await authService.login(credentials);
    persistSession(data);
    return data;
  }

  async function register(details) {
    const data = await authService.register(details);
    persistSession(data);
    return data;
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }
  return context;
}
