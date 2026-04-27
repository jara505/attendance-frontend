import { describe, it, expect } from 'vitest';
import api from '../axios';

describe('axios api instance', () => {
  it('exposes a configured axios instance', () => {
    expect(api).toBeDefined();
    expect(api.defaults).toBeDefined();
    expect(typeof api.get).toBe('function');
    expect(typeof api.post).toBe('function');
  });

  it('uses fallback baseURL when VITE_API_URL is not set', () => {
    // In test env VITE_API_URL is undefined, so fallback applies.
    expect(api.defaults.baseURL).toBe('http://localhost:8000/api/v1');
  });

  it('sets JSON Content-Type header by default', () => {
    expect(api.defaults.headers['Content-Type']).toBe('application/json');
  });
});
