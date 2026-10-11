import { apiClient } from './apiClient';
import type {
  ApiResponse,
  CreateDocumentoDto,
  Documento,
  EstadoDocumento,
  FindAllDocumentosQuery,
  UpdateDocumentoDto,
} from '../types/Documento';

export const documentoApi = {
  getAll: async (params: FindAllDocumentosQuery = {}) => {
    const response = await apiClient.get<ApiResponse<Documento[]>>('/api/documentos', { params });
    return response.data;
  },
  create: async (data: CreateDocumentoDto) => {
    const response = await apiClient.post<ApiResponse<Documento>>('/api/documentos', data);
    return response.data.data;
  },
  update: async (id: string, data: UpdateDocumentoDto) => {
    const response = await apiClient.put<ApiResponse<Documento>>(`/api/documentos/${id}`, data);
    return response.data.data;
  },
  cambiarEstado: async (id: string, estado: EstadoDocumento, observacion?: string | null) => {
    const response = await apiClient.patch<ApiResponse<Documento>>(`/api/documentos/${id}/estado`, {
      estado,
      observacion,
    });
    return response.data.data;
  },
  delete: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<null>>(`/api/documentos/${id}`);
    return response.data;
  },
};
