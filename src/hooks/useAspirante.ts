import { useAspiranteStore } from '../stores/aspiranteStore';

export const useAspirante = () => {
  const aspirantes = useAspiranteStore((state) => state.aspirantes);
  const total = useAspiranteStore((state) => state.total);
  const page = useAspiranteStore((state) => state.page);
  const limit = useAspiranteStore((state) => state.limit);
  const isLoading = useAspiranteStore((state) => state.isLoading);
  const selectedAspirante = useAspiranteStore((state) => state.selectedAspirante);
  
  const fetchAspirantes = useAspiranteStore((state) => state.fetchAspirantes);
  const createAspirante = useAspiranteStore((state) => state.createAspirante);
  const updateAspirante = useAspiranteStore((state) => state.updateAspirante);
  const setSelectedAspirante = useAspiranteStore((state) => state.setSelectedAspirante);

  return { aspirantes, total, page, limit, isLoading, selectedAspirante, fetchAspirantes, createAspirante, updateAspirante, setSelectedAspirante };
};