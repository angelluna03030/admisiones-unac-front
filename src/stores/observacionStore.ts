/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { observacionApi } from '../api/observacion';
import type {
  CreateObservacionDto,
  FindAllObservacionesQuery,
  Observacion,
  ResultadoWhatsapp,
  UpdateObservacionDto,
} from '../types/Observacion';

interface ObservacionStore {
  observaciones: Observacion[];
  filters: FindAllObservacionesQuery;
  isLoading: boolean;
  error: string | null;
  selectedObservacion: Observacion | null;

  fetchObservaciones: (filters?: FindAllObservacionesQuery) => Promise<void>;
  createObservacion: (data: CreateObservacionDto) => Promise<ResultadoWhatsapp>;
  updateObservacion: (id: string, data: UpdateObservacionDto) => Promise<void>;
  resolverObservacion: (id: string, resuelta: boolean) => Promise<void>;
  deleteObservacion: (id: string) => Promise<void>;
  setSelectedObservacion: (observacion: Observacion | null) => void;
}

export const useObservacionStore = create<ObservacionStore>((set, get) => ({
  observaciones: [],
  filters: {},
  isLoading: false,
  error: null,
  selectedObservacion: null,

  fetchObservaciones: async (filters) => {
    const activeFilters = filters ?? get().filters;
    set({ isLoading: true, error: null, filters: activeFilters });
    try {
      const response = await observacionApi.getAll(activeFilters);
      set({ observaciones: response.data || [], isLoading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Error al cargar observaciones', isLoading: false });
    }
  },

  createObservacion: async (data) => {
    const response = await observacionApi.create(data);
    await get().fetchObservaciones();
    return response.whatsapp ?? 'NO_SOLICITADO';
  },

  updateObservacion: async (id, data) => {
    await observacionApi.update(id, data);
    set({ selectedObservacion: null });
    await get().fetchObservaciones();
  },

  resolverObservacion: async (id, resuelta) => {
    await observacionApi.resolver(id, resuelta);
    await get().fetchObservaciones();
  },

  deleteObservacion: async (id) => {
    await observacionApi.delete(id);
    await get().fetchObservaciones();
  },

  setSelectedObservacion: (observacion) => set({ selectedObservacion: observacion }),
}));
