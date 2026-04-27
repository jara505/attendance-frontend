import { useState } from 'react';
import { AuthContext } from './authContext';

function readInitialUser() {
  // Synchronous restore so consumers get the correct value on first render.
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const mustChangePassword = localStorage.getItem('must_change_password');

  if (token && role) {
    return { role, mustChangePassword: mustChangePassword === 'true' };
  }
  return null;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readInitialUser);

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

  // `loading` is kept for API compatibility with consumers that check it.
  // Session is restored synchronously, so it is always false.
  return (
    <AuthContext.Provider value={{ user, login, logout, loading: false }}>
      {children}
    </AuthContext.Provider>
  );
}
