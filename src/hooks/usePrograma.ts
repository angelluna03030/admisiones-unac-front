import { useProgramaStore } from '../stores/programaStore';

export const usePrograma = () => {
  const programas = useProgramaStore((state) => state.programas);
  const total = useProgramaStore((state) => state.total);
  const page = useProgramaStore((state) => state.page);
  const limit = useProgramaStore((state) => state.limit);
  const isLoading = useProgramaStore((state) => state.isLoading);
  const error = useProgramaStore((state) => state.error);
  const selectedPrograma = useProgramaStore((state) => state.selectedPrograma);

  const fetchProgramas = useProgramaStore((state) => state.fetchProgramas);
  const createPrograma = useProgramaStore((state) => state.createPrograma);
  const updatePrograma = useProgramaStore((state) => state.updatePrograma);
  const toggleStatus = useProgramaStore((state) => state.toggleStatus);
  const setSelectedPrograma = useProgramaStore((state) => state.setSelectedPrograma);
  const clearError = useProgramaStore((state) => state.clearError);

  return {
    programas,
    total,
    page,
    limit,
    isLoading,
    error,
    selectedPrograma,
    fetchProgramas,
    createPrograma,
    updatePrograma,
    toggleStatus,
    setSelectedPrograma,
    clearError,
  };
};