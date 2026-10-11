import { apiClient } from './apiClient';
import type {
  ApiResponse,
  CreateObservacionDto,
  FindAllObservacionesQuery,
  Observacion,
  UpdateObservacionDto,
} from '../types/Observacion';

export const observacionApi = {
  getAll: async (params: FindAllObservacionesQuery = {}) => {
    const response = await apiClient.get<ApiResponse<Observacion[]>>('/api/observaciones', { params });
    return response.data;
  },
  create: async (data: CreateObservacionDto) => {
    const response = await apiClient.post<ApiResponse<Observacion>>('/api/observaciones', data);
    return response.data;
  },
  update: async (id: string, data: UpdateObservacionDto) => {
    const response = await apiClient.put<ApiResponse<Observacion>>(`/api/observaciones/${id}`, data);
    return response.data.data;
  },
  resolver: async (id: string, resuelta: boolean) => {
    const response = await apiClient.patch<ApiResponse<Observacion>>(`/api/observaciones/${id}/resolver`, { resuelta });
    return response.data.data;
  },
  delete: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<null>>(`/api/observaciones/${id}`);
    return response.data;
  },
};
