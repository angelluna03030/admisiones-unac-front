import { apiClient } from './apiClient';
import type {
  ApiResponse,
  ConversionData,
  DashboardActivity,
  DashboardAlerts,
  DashboardFilters,
  DashboardKPIs,
  FunnelData,
  ProgramMetric,
  TrendData,
  TrendGroupBy,
} from '../types/Dashboard';

export const dashboardApi = {
  getKPIs: async (params: DashboardFilters) => {
    const response = await apiClient.get<ApiResponse<DashboardKPIs>>('/api/dashboard/kpis', { params });
    return response.data.data;
  },

  getFunnel: async (params: DashboardFilters) => {
    const response = await apiClient.get<ApiResponse<FunnelData[]>>('/api/dashboard/funnel', { params });
    return response.data.data;
  },

  getConversion: async (params: DashboardFilters) => {
    const response = await apiClient.get<ApiResponse<ConversionData[]>>('/api/dashboard/conversion', { params });
    return response.data.data;
  },

  getAlerts: async (params: DashboardFilters) => {
    // El endpoint de alertas solo acepta rol y programa
    const response = await apiClient.get<ApiResponse<DashboardAlerts>>('/api/dashboard/alerts', {
      params: { rol: params.rol, programaId: params.programaId },
    });
    return response.data.data;
  },

  getTrends: async (params: DashboardFilters & { groupBy?: TrendGroupBy }) => {
    const response = await apiClient.get<ApiResponse<TrendData[]>>('/api/dashboard/trends', {
      params: {
        startDate: params.startDate,
        endDate: params.endDate,
        programaId: params.programaId,
        groupBy: params.groupBy,
      },
    });
    return response.data.data;
  },

  getProgramas: async (params: DashboardFilters) => {
    const response = await apiClient.get<ApiResponse<ProgramMetric[]>>('/api/dashboard/programas', { params });
    return response.data.data;
  },

  getActivity: async (params: DashboardFilters) => {
    const response = await apiClient.get<ApiResponse<DashboardActivity>>('/api/dashboard/actividad', { params });
    return response.data.data;
  },
};
