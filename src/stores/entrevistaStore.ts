/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { entrevistaApi } from '../api/entrevista';
import type {
  CreateEntrevistaDto,
  Entrevista,
  EvaluacionPayload,
  FindAllEntrevistasQuery,
  UpdateEntrevistaDto,
} from '../types/Entrevista';

interface EntrevistaStore {
  entrevistas: Entrevista[];
  filters: FindAllEntrevistasQuery;
  isLoading: boolean;
  error: string | null;
  selectedEntrevista: Entrevista | null;

  fetchEntrevistas: (filters?: FindAllEntrevistasQuery) => Promise<void>;
  createEntrevista: (data: CreateEntrevistaDto) => Promise<void>;
  updateEntrevista: (id: string, data: UpdateEntrevistaDto) => Promise<void>;
  deleteEntrevista: (id: string) => Promise<void>;
  evaluarEntrevista: (id: string, data: EvaluacionPayload) => Promise<void>;
  setSelectedEntrevista: (entrevista: Entrevista | null) => void;
}

export const useEntrevistaStore = create<EntrevistaStore>((set, get) => ({
  entrevistas: [],
  filters: {},
  isLoading: false,
  error: null,
  selectedEntrevista: null,

  fetchEntrevistas: async (filters) => {
    const activeFilters = filters ?? get().filters;
    set({ isLoading: true, error: null, filters: activeFilters });
    try {
      const response = await entrevistaApi.getAll(activeFilters);
      set({ entrevistas: response.data || [], isLoading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Error al cargar entrevistas', isLoading: false });
    }
  },

  createEntrevista: async (data) => {
    await entrevistaApi.create(data);
    await get().fetchEntrevistas();
  },

  updateEntrevista: async (id, data) => {
    await entrevistaApi.update(id, data);
    set({ selectedEntrevista: null });
    await get().fetchEntrevistas();
  },

  deleteEntrevista: async (id) => {
    await entrevistaApi.delete(id);
    await get().fetchEntrevistas();
  },

  evaluarEntrevista: async (id, data) => {
    await entrevistaApi.evaluar(id, data);
    await get().fetchEntrevistas();
  },

  setSelectedEntrevista: (entrevista) => set({ selectedEntrevista: entrevista }),
}));
