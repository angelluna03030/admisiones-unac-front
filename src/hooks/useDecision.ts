import { useDecisionStore } from '../stores/decisionStore';

export const useDecision = () => {
  const decisiones = useDecisionStore((state) => state.decisiones);
  const filters = useDecisionStore((state) => state.filters);
  const isLoading = useDecisionStore((state) => state.isLoading);
  const error = useDecisionStore((state) => state.error);
  const selectedDecision = useDecisionStore((state) => state.selectedDecision);

  const fetchDecisiones = useDecisionStore((state) => state.fetchDecisiones);
  const createDecision = useDecisionStore((state) => state.createDecision);
  const updateDecision = useDecisionStore((state) => state.updateDecision);
  const ratificarDecision = useDecisionStore((state) => state.ratificarDecision);
  const deleteDecision = useDecisionStore((state) => state.deleteDecision);
  const setSelectedDecision = useDecisionStore((state) => state.setSelectedDecision);

  return {
    decisiones,
    filters,
    isLoading,
    error,
    selectedDecision,
    fetchDecisiones,
    createDecision,
    updateDecision,
    ratificarDecision,
    deleteDecision,
    setSelectedDecision,
  };
};
