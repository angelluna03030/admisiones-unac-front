import { apiClient } from './apiClient';
import type {
  ApiResponse,
  CreateSolicitudDto,
  EstadoSolicitud,
  FindAllSolicitudesQuery,
  SolicitudDetalle,
  SolicitudResumen,
  UpdateSolicitudDto,
} from '../types/Solicitud';

export const solicitudApi = {
  getAll: async (params: FindAllSolicitudesQuery) => {
    const response = await apiClient.get<ApiResponse<SolicitudResumen[]>>('/api/solicitudes', { params });
    return response.data;
  },
  getById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<SolicitudDetalle>>(`/api/solicitudes/${id}`);
    return response.data.data;
  },
  create: async (data: CreateSolicitudDto) => {
    const response = await apiClient.post<ApiResponse<SolicitudResumen>>('/api/solicitudes', data);
    return response.data.data;
  },
  update: async (id: string, data: UpdateSolicitudDto) => {
    const response = await apiClient.put<ApiResponse<SolicitudResumen>>(`/api/solicitudes/${id}`, data);
    return response.data.data;
  },
  cambiarEstado: async (id: string, estado: EstadoSolicitud) => {
    const response = await apiClient.patch<ApiResponse<SolicitudResumen>>(`/api/solicitudes/${id}/estado`, { estado });
    return response.data.data;
  },
};
