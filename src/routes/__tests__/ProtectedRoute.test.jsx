import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import { ProtectedRoute } from '../ProtectedRoute';

function renderWithRouter(initialEntries) {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route path="/login" element={<div>LOGIN_PAGE</div>} />
          <Route
            path="/change-password"
            element={
              <ProtectedRoute>
                <div>CHANGE_PASSWORD_PAGE</div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div>DASHBOARD_PAGE</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    </AuthProvider>,
  );
}

describe('ProtectedRoute', () => {
  it('redirects to /login when no user is authenticated', async () => {
    renderWithRouter(['/dashboard']);
    expect(await screen.findByText('LOGIN_PAGE')).toBeInTheDocument();
  });

  it('renders children when an authenticated user has no pending password change', async () => {
    localStorage.setItem('token', 'fake-jwt');
    localStorage.setItem('role', 'admin');
    localStorage.setItem('must_change_password', 'false');

    renderWithRouter(['/dashboard']);
    expect(await screen.findByText('DASHBOARD_PAGE')).toBeInTheDocument();
  });

  it('redirects to /change-password when mustChangePassword is true and route is not /change-password', async () => {
    localStorage.setItem('token', 'fake-jwt');
    localStorage.setItem('role', 'admin');
    localStorage.setItem('must_change_password', 'true');

    renderWithRouter(['/dashboard']);
    expect(await screen.findByText('CHANGE_PASSWORD_PAGE')).toBeInTheDocument();
  });

  it('allows access to /change-password when mustChangePassword is true', async () => {
    localStorage.setItem('token', 'fake-jwt');
    localStorage.setItem('role', 'admin');
    localStorage.setItem('must_change_password', 'true');

    renderWithRouter(['/change-password']);
    expect(await screen.findByText('CHANGE_PASSWORD_PAGE')).toBeInTheDocument();
  });
});
