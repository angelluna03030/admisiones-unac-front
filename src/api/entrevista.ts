import { apiClient } from './apiClient';
import type {
  ApiResponse,
  CreateEntrevistaDto,
  Entrevista,
  EvaluacionPayload,
  FindAllEntrevistasQuery,
  UpdateEntrevistaDto,
} from '../types/Entrevista';

export const entrevistaApi = {
  getAll: async (params: FindAllEntrevistasQuery = {}) => {
    const response = await apiClient.get<ApiResponse<Entrevista[]>>('/api/entrevistas', { params });
    return response.data;
  },
  getById: async (id: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await apiClient.get<ApiResponse<Entrevista & { evaluacionCapellania: any; evaluacionAcademica: any }>>(
      `/api/entrevistas/${id}`,
    );
    return response.data.data;
  },
  create: async (data: CreateEntrevistaDto) => {
    const response = await apiClient.post<ApiResponse<Entrevista>>('/api/entrevistas', data);
    return response.data.data;
  },
  update: async (id: string, data: UpdateEntrevistaDto) => {
    const response = await apiClient.put<ApiResponse<Entrevista>>(`/api/entrevistas/${id}`, data);
    return response.data.data;
  },
  delete: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<null>>(`/api/entrevistas/${id}`);
    return response.data;
  },
  evaluar: async (id: string, data: EvaluacionPayload) => {
    const response = await apiClient.post<ApiResponse<unknown>>(`/api/entrevistas/${id}/evaluacion`, data);
    return response.data.data;
  },
};
