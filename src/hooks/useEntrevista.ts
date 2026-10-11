import { useEntrevistaStore } from '../stores/entrevistaStore';

export const useEntrevista = () => {
  const entrevistas = useEntrevistaStore((state) => state.entrevistas);
  const filters = useEntrevistaStore((state) => state.filters);
  const isLoading = useEntrevistaStore((state) => state.isLoading);
  const error = useEntrevistaStore((state) => state.error);
  const selectedEntrevista = useEntrevistaStore((state) => state.selectedEntrevista);

  const fetchEntrevistas = useEntrevistaStore((state) => state.fetchEntrevistas);
  const createEntrevista = useEntrevistaStore((state) => state.createEntrevista);
  const updateEntrevista = useEntrevistaStore((state) => state.updateEntrevista);
  const deleteEntrevista = useEntrevistaStore((state) => state.deleteEntrevista);
  const evaluarEntrevista = useEntrevistaStore((state) => state.evaluarEntrevista);
  const setSelectedEntrevista = useEntrevistaStore((state) => state.setSelectedEntrevista);

  return {
    entrevistas,
    filters,
    isLoading,
    error,
    selectedEntrevista,
    fetchEntrevistas,
    createEntrevista,
    updateEntrevista,
    deleteEntrevista,
    evaluarEntrevista,
    setSelectedEntrevista,
  };
};
