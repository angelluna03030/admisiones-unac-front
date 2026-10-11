import { useDashboardStore } from '../stores/dashboardStore';

export const useDashboard = () => {
  const kpis = useDashboardStore((state) => state.kpis);
  const funnel = useDashboardStore((state) => state.funnel);
  const conversion = useDashboardStore((state) => state.conversion);
  const alerts = useDashboardStore((state) => state.alerts);
  const trends = useDashboardStore((state) => state.trends);
  const programas = useDashboardStore((state) => state.programas);
  const activity = useDashboardStore((state) => state.activity);
  const trendGroupBy = useDashboardStore((state) => state.trendGroupBy);
  const isLoading = useDashboardStore((state) => state.isLoading);
  const error = useDashboardStore((state) => state.error);
  const filters = useDashboardStore((state) => state.filters);

  const fetchDashboardData = useDashboardStore((state) => state.fetchDashboardData);
  const fetchTrends = useDashboardStore((state) => state.fetchTrends);
  const setFilters = useDashboardStore((state) => state.setFilters);

  return {
    kpis,
    funnel,
    conversion,
    alerts,
    trends,
    programas,
    activity,
    trendGroupBy,
    isLoading,
    error,
    filters,
    fetchDashboardData,
    fetchTrends,
    setFilters,
  };
};
