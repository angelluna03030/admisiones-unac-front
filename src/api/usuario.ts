import { apiClient } from './apiClient';
import type { Usuario, CreateUsuarioDto, UpdateUsuarioDto, ApiResponse } from '../types/Usuario';

export const usuarioApi = {
  getAll: async () => {
    const response = await apiClient.get<ApiResponse<Usuario[]>>('/api/usuarios');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<Usuario>>(`/api/usuarios/${id}`);
    return response.data.data;
  },
  create: async (data: CreateUsuarioDto) => {
    const response = await apiClient.post<ApiResponse<Usuario>>('/api/usuarios', data);
    return response.data.data;
  },
  update: async (id: string, data: UpdateUsuarioDto) => {
    const response = await apiClient.put<ApiResponse<Usuario>>(`/api/usuarios/${id}`, data);
    return response.data.data;
  },
  delete: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<Usuario>>(`/api/usuarios/${id}`);
    return response.data;
  },
};