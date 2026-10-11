import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL  || 'http://localhost:3000',
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

/** Evento global que se emite cuando el backend rechaza la sesión (401). */
export const SESION_EXPIRADA = 'auth:sesion-expirada';

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const url: string = error.config?.url ?? '';
    if (error.response?.status === 401 && !url.startsWith('/api/auth/')) {
      window.dispatchEvent(new Event(SESION_EXPIRADA));
    }
    return Promise.reject(error);
  },
);

export const buildQueryParams = <T extends Record<string, unknown>>(
  params: T,
) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return;
    }

    searchParams.set(key, String(value));
  });

  return searchParams;
};