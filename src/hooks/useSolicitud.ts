import { useSolicitudStore } from '../stores/solicitudStore';

export const useSolicitud = () => {
  const solicitudes = useSolicitudStore((state) => state.solicitudes);
  const total = useSolicitudStore((state) => state.total);
  const page = useSolicitudStore((state) => state.page);
  const limit = useSolicitudStore((state) => state.limit);
  const filters = useSolicitudStore((state) => state.filters);
  const isLoading = useSolicitudStore((state) => state.isLoading);
  const error = useSolicitudStore((state) => state.error);
  const selectedSolicitud = useSolicitudStore((state) => state.selectedSolicitud);
  const detalle = useSolicitudStore((state) => state.detalle);
  const isLoadingDetalle = useSolicitudStore((state) => state.isLoadingDetalle);

  const fetchSolicitudes = useSolicitudStore((state) => state.fetchSolicitudes);
  const fetchDetalle = useSolicitudStore((state) => state.fetchDetalle);
  const createSolicitud = useSolicitudStore((state) => state.createSolicitud);
  const updateSolicitud = useSolicitudStore((state) => state.updateSolicitud);
  const cambiarEstado = useSolicitudStore((state) => state.cambiarEstado);
  const setSelectedSolicitud = useSolicitudStore((state) => state.setSelectedSolicitud);
  const clearDetalle = useSolicitudStore((state) => state.clearDetalle);

  return {
    solicitudes,
    total,
    page,
    limit,
    filters,
    isLoading,
    error,
    selectedSolicitud,
    detalle,
    isLoadingDetalle,
    fetchSolicitudes,
    fetchDetalle,
    createSolicitud,
    updateSolicitud,
    cambiarEstado,
    setSelectedSolicitud,
    clearDetalle,
  };
};
