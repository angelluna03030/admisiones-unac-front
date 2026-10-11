import { apiClient } from './apiClient';
import type { RolUsuario } from '../utils/permisos';

export interface UsuarioSesion {
  id: string;
  nombres: string;
  apellidos: string;
  correo: string;
  rol: RolUsuario;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const authApi = {
  login: async (correo: string, password: string) => {
    const response = await apiClient.post<ApiResponse<UsuarioSesion>>('/api/auth/login', { correo, password });
    return response.data.data;
  },
  me: async () => {
    const response = await apiClient.get<ApiResponse<UsuarioSesion>>('/api/auth/me');
    return response.data.data;
  },
  logout: async () => {
    await apiClient.post('/api/auth/logout');
  },
  cambiarPassword: async (passwordActual: string, passwordNueva: string) => {
    const response = await apiClient.put<ApiResponse<null>>('/api/auth/password', { passwordActual, passwordNueva });
    return response.data;
  },
};
