import { apiClient } from './apiClient';
import type {
  ProgramaAcademico,
  CreateProgramaDto,
  UpdateProgramaDto,
  FindAllProgramasQuery,
  ApiResponse,
} from '../types/ProgramaAcademico';
export const programaApi = {
  getAll: async (params: FindAllProgramasQuery) => {
    // ✅ Agregado /api
    const response = await apiClient.get<ApiResponse<ProgramaAcademico[]>>('/api/programas', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<ProgramaAcademico>>(`/api/programas/${id}`);
    return response.data.data;
  },

  create: async (data: CreateProgramaDto) => {
    const response = await apiClient.post<ApiResponse<ProgramaAcademico>>('/api/programas', data);
    return response.data.data;
  },

  update: async (id: string, data: UpdateProgramaDto) => {
    const response = await apiClient.put<ApiResponse<ProgramaAcademico>>(`/api/programas/${id}`, data);
    return response.data.data;
  },

  toggleStatus: async (id: string) => {
    const response = await apiClient.patch<ApiResponse<{ activo: boolean }>>(`/api/programas/${id}/estado`);
    return response.data;
  },
};