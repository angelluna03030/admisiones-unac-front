import { create } from 'zustand';
import { programaApi } from '../api/programa';
import type {
  ProgramaAcademico,
  CreateProgramaDto,
  UpdateProgramaDto,
  FindAllProgramasQuery,
} from '../types/ProgramaAcademico';

interface ProgramaStore {
  programas: ProgramaAcademico[];
  total: number;
  page: number;
  limit: number;
  isLoading: boolean;
  error: string | null;
  selectedPrograma: ProgramaAcademico | null;

  fetchProgramas: (params: FindAllProgramasQuery) => Promise<void>;
  createPrograma: (data: CreateProgramaDto) => Promise<void>;
  updatePrograma: (id: string, data: UpdateProgramaDto) => Promise<void>;
  toggleStatus: (id: string) => Promise<void>;
  setSelectedPrograma: (programa: ProgramaAcademico | null) => void;
  clearError: () => void;
}

export const useProgramaStore = create<ProgramaStore>((set, get) => ({
  programas: [],
  total: 0,
  page: 1,
  limit: 10,
  isLoading: false,
  error: null,
  selectedPrograma: null,

  fetchProgramas: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const response = await programaApi.getAll(params);
      set({
        programas: response.data,
        total: response.total || 0,
        page: response.page || 1,
        limit: response.limit || 10,
        isLoading: false,
      });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Error al cargar programas',
        isLoading: false,
      });
    }
  },

  createPrograma: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await programaApi.create(data);
      set({ isLoading: false });
      await get().fetchProgramas({ page: 1, limit: get().limit });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Error al crear programa', isLoading: false });
      throw error;
    }
  },

  updatePrograma: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      await programaApi.update(id, data);
      set({ isLoading: false, selectedPrograma: null });
      await get().fetchProgramas({ page: get().page, limit: get().limit });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Error al actualizar', isLoading: false });
      throw error;
    }
  },

  toggleStatus: async (id) => {
    try {
      await programaApi.toggleStatus(id);
      await get().fetchProgramas({ page: get().page, limit: get().limit });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Error al cambiar estado' });
    }
  },

  setSelectedPrograma: (programa) => set({ selectedPrograma: programa }),
  clearError: () => set({ error: null }),
}));