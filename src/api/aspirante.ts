import { apiClient } from './apiClient';
import type { Aspirante, CreateAspiranteDto, UpdateAspiranteDto, FindAllAspirantesQuery, ApiResponse } from '../types/Aspirante';

export const aspiranteApi = {
  getAll: async (params: FindAllAspirantesQuery) => {
    const response = await apiClient.get<ApiResponse<Aspirante[]>>('/aspirantes', { params });
    return response.data;
  },
  getById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<Aspirante>>(`/aspirantes/${id}`);
    return response.data.data;
  },
  create: async (data: CreateAspiranteDto) => {
    const response = await apiClient.post<ApiResponse<Aspirante>>('/aspirantes', data);
    return response.data.data;
  },
  update: async (id: string, data: UpdateAspiranteDto) => {
    const response = await apiClient.put<ApiResponse<Aspirante>>(`/aspirantes/${id}`, data);
    return response.data.data;
  },
};