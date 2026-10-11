/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { decisionApi } from '../api/decision';
import type {
  CreateDecisionDto,
  Decision,
  FindAllDecisionesQuery,
  RatificarDecisionDto,
  UpdateDecisionDto,
} from '../types/Decision';

interface DecisionStore {
  decisiones: Decision[];
  filters: FindAllDecisionesQuery;
  isLoading: boolean;
  error: string | null;
  selectedDecision: Decision | null;

  fetchDecisiones: (filters?: FindAllDecisionesQuery) => Promise<void>;
  createDecision: (data: CreateDecisionDto) => Promise<void>;
  updateDecision: (id: string, data: UpdateDecisionDto) => Promise<void>;
  ratificarDecision: (id: string, data: RatificarDecisionDto) => Promise<void>;
  deleteDecision: (id: string) => Promise<void>;
  setSelectedDecision: (decision: Decision | null) => void;
}

export const useDecisionStore = create<DecisionStore>((set, get) => ({
  decisiones: [],
  filters: {},
  isLoading: false,
  error: null,
  selectedDecision: null,

  fetchDecisiones: async (filters) => {
    const activeFilters = filters ?? get().filters;
    set({ isLoading: true, error: null, filters: activeFilters });
    try {
      const response = await decisionApi.getAll(activeFilters);
      set({ decisiones: response.data || [], isLoading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Error al cargar decisiones', isLoading: false });
    }
  },

  createDecision: async (data) => {
    await decisionApi.create(data);
    await get().fetchDecisiones();
  },

  updateDecision: async (id, data) => {
    await decisionApi.update(id, data);
    set({ selectedDecision: null });
    await get().fetchDecisiones();
  },

  ratificarDecision: async (id, data) => {
    await decisionApi.ratificar(id, data);
    await get().fetchDecisiones();
  },

  deleteDecision: async (id) => {
    await decisionApi.delete(id);
    await get().fetchDecisiones();
  },

  setSelectedDecision: (decision) => set({ selectedDecision: decision }),
}));
