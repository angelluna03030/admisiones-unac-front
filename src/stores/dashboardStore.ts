import { create } from 'zustand';
import { dashboardApi } from '../api/dashboard';
import type {
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

interface DashboardStore {
  kpis: DashboardKPIs | null;
  funnel: FunnelData[];
  conversion: ConversionData[];
  alerts: DashboardAlerts | null;
  trends: TrendData[];
  programas: ProgramMetric[];
  activity: DashboardActivity | null;
  trendGroupBy: TrendGroupBy;
  isLoading: boolean;
  error: string | null;
  filters: DashboardFilters;

  fetchDashboardData: (filters: DashboardFilters) => Promise<void>;
  fetchTrends: (groupBy: TrendGroupBy) => Promise<void>;
  setFilters: (filters: Partial<DashboardFilters>) => void;
}

export const useDashboardStore = create<DashboardStore>((set, get) => ({
  kpis: null,
  funnel: [],
  conversion: [],
  alerts: null,
  trends: [],
  programas: [],
  activity: null,
  trendGroupBy: 'month',
  isLoading: false,
  error: null,
  filters: {},

  fetchDashboardData: async (filters) => {
    set({ isLoading: true, error: null, filters });
    try {
      // Ejecutamos todas las llamadas en paralelo para máxima velocidad
      const [kpis, funnel, conversion, alerts, trends, programas, activity] = await Promise.all([
        dashboardApi.getKPIs(filters),
        dashboardApi.getFunnel(filters),
        dashboardApi.getConversion(filters),
        dashboardApi.getAlerts(filters),
        dashboardApi.getTrends({ ...filters, groupBy: get().trendGroupBy }),
        dashboardApi.getProgramas(filters),
        dashboardApi.getActivity(filters),
      ]);

      set({ kpis, funnel, conversion, alerts, trends, programas, activity, isLoading: false });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Error al cargar el dashboard',
        isLoading: false,
      });
    }
  },

  // Cambiar la agrupación solo recarga la tendencia, no todo el tablero
  fetchTrends: async (groupBy) => {
    set({ trendGroupBy: groupBy });
    try {
      const trends = await dashboardApi.getTrends({ ...get().filters, groupBy });
      set({ trends });
    } catch {
      set({ trends: [] });
    }
  },

  setFilters: (newFilters) => {
    const updatedFilters = { ...get().filters, ...newFilters };
    set({ filters: updatedFilters });
    // Auto-refetch al cambiar filtros
    get().fetchDashboardData(updatedFilters);
  },
}));
