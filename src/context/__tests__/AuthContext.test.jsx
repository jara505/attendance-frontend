import { describe, it, expect } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';

const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;

describe('AuthContext', () => {
  it('starts with no user once loading completes', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.user).toBeNull();
  });

  it('restores session from localStorage when token + role exist', async () => {
    localStorage.setItem('token', 'fake-jwt');
    localStorage.setItem('role', 'admin');
    localStorage.setItem('must_change_password', 'true');

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.user).toEqual({
      role: 'admin',
      mustChangePassword: true,
    });
  });

  it('login() sets user and persists role + flag in localStorage', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => result.current.login('teacher', false));

    expect(result.current.user).toEqual({
      role: 'teacher',
      mustChangePassword: false,
    });
    expect(localStorage.getItem('role')).toBe('teacher');
    expect(localStorage.getItem('must_change_password')).toBe('false');
  });

  it('logout() clears user and removes auth keys from localStorage', async () => {
    localStorage.setItem('token', 'fake-jwt');
    localStorage.setItem('role', 'admin');
    localStorage.setItem('must_change_password', 'false');

    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.user).not.toBeNull());

    act(() => result.current.logout());

    expect(result.current.user).toBeNull();
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('role')).toBeNull();
    expect(localStorage.getItem('must_change_password')).toBeNull();
  });

  it('useAuth() throws when used outside AuthProvider', () => {
    expect(() => renderHook(() => useAuth())).toThrow(
      /useAuth must be used within AuthProvider/,
    );
  });
});
