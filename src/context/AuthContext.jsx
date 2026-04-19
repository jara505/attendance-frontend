import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore session from localStorage on mount
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const mustChangePassword = localStorage.getItem('must_change_password');

    if (token && role) {
      setUser({ role, mustChangePassword: mustChangePassword === 'true' });
    }
    setLoading(false);
  }, []);

  const login = (role, mustChangePassword = false) => {
    localStorage.setItem('role', role);
    localStorage.setItem('must_change_password', mustChangePassword);
    setUser({ role, mustChangePassword });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('must_change_password');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}