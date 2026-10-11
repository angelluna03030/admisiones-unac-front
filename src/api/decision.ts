import { apiClient } from './apiClient';
import type {
  ApiResponse,
  CreateDecisionDto,
  Decision,
  FindAllDecisionesQuery,
  RatificarDecisionDto,
  UpdateDecisionDto,
} from '../types/Decision';

export const decisionApi = {
  getAll: async (params: FindAllDecisionesQuery = {}) => {
    const response = await apiClient.get<ApiResponse<Decision[]>>('/api/decisiones', { params });
    return response.data;
  },
  create: async (data: CreateDecisionDto) => {
    const response = await apiClient.post<ApiResponse<Decision>>('/api/decisiones', data);
    return response.data.data;
  },
  update: async (id: string, data: UpdateDecisionDto) => {
    const response = await apiClient.put<ApiResponse<Decision>>(`/api/decisiones/${id}`, data);
    return response.data.data;
  },
  ratificar: async (id: string, data: RatificarDecisionDto) => {
    const response = await apiClient.patch<ApiResponse<Decision>>(`/api/decisiones/${id}/ratificacion`, data);
    return response.data.data;
  },
  delete: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<null>>(`/api/decisiones/${id}`);
    return response.data;
  },
};
