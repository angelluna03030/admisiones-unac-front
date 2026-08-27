import { create } from 'zustand';
import { aspiranteApi } from '../api/aspirante';
import type { Aspirante, CreateAspiranteDto, UpdateAspiranteDto, FindAllAspirantesQuery } from '../types/Aspirante';

interface AspiranteStore {
  aspirantes: Aspirante[];
  total: number;
  page: number;
  limit: number;
  isLoading: boolean;
  error: string | null;
  selectedAspirante: Aspirante | null;

  fetchAspirantes: (params: FindAllAspirantesQuery) => Promise<void>;
  createAspirante: (data: CreateAspiranteDto) => Promise<void>;
  updateAspirante: (id: string, data: UpdateAspiranteDto) => Promise<void>;
  setSelectedAspirante: (aspirante: Aspirante | null) => void;
}

export const useAspiranteStore = create<AspiranteStore>((set, get) => ({
  aspirantes: [],
  total: 0,
  page: 1,
  limit: 10,
  isLoading: false,
  error: null,
  selectedAspirante: null,

  fetchAspirantes: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const response = await aspiranteApi.getAll(params);
      set({ aspirantes: response.data, total: response.total || 0, page: response.page || 1, limit: response.limit || 10, isLoading: false });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Error al cargar aspirantes', isLoading: false });
    }
  },

  createAspirante: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await aspiranteApi.create(data);
      set({ isLoading: false });
      await get().fetchAspirantes({ page: 1, limit: get().limit });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Error al crear aspirante', isLoading: false });
      throw error;
    }
  },

  updateAspirante: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      await aspiranteApi.update(id, data);
      set({ isLoading: false, selectedAspirante: null });
      await get().fetchAspirantes({ page: get().page, limit: get().limit });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Error al actualizar', isLoading: false });
      throw error;
    }
  },

  setSelectedAspirante: (aspirante) => set({ selectedAspirante: aspirante }),
}));