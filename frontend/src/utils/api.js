const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

/**
 * Retrieves the current authentication token from localStorage
 */
export const getAuthToken = () => {
  try {
    const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');
    if (adminUser?.token) return adminUser.token;

    const patientUser = JSON.parse(localStorage.getItem('patientUser') || '{}');
    if (patientUser?.token) return patientUser.token;

    const legacyUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (legacyUser?.token) return legacyUser.token;

    return localStorage.getItem('token') || '';
  } catch {
    return localStorage.getItem('token') || '';
  }
};

/**
 * Builds standard request headers with Authorization Bearer token if present
 */
export const getAuthHeaders = (customHeaders = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

/**
 * Helper to make API requests with credentials and auth headers
 */
export const apiFetch = async (endpoint, options = {}) => {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  
  const headers = getAuthHeaders(options.headers || {});
  
  return fetch(url, {
    credentials: 'include',
    ...options,
    headers,
  });
};

export default apiFetch;
