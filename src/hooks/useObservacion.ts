import { useObservacionStore } from '../stores/observacionStore';

export const useObservacion = () => {
  const observaciones = useObservacionStore((state) => state.observaciones);
  const filters = useObservacionStore((state) => state.filters);
  const isLoading = useObservacionStore((state) => state.isLoading);
  const error = useObservacionStore((state) => state.error);
  const selectedObservacion = useObservacionStore((state) => state.selectedObservacion);

  const fetchObservaciones = useObservacionStore((state) => state.fetchObservaciones);
  const createObservacion = useObservacionStore((state) => state.createObservacion);
  const updateObservacion = useObservacionStore((state) => state.updateObservacion);
  const resolverObservacion = useObservacionStore((state) => state.resolverObservacion);
  const deleteObservacion = useObservacionStore((state) => state.deleteObservacion);
  const setSelectedObservacion = useObservacionStore((state) => state.setSelectedObservacion);

  return {
    observaciones,
    filters,
    isLoading,
    error,
    selectedObservacion,
    fetchObservaciones,
    createObservacion,
    updateObservacion,
    resolverObservacion,
    deleteObservacion,
    setSelectedObservacion,
  };
};
