/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { solicitudApi } from '../api/solicitud';
import type {
  CreateSolicitudDto,
  EstadoSolicitud,
  FindAllSolicitudesQuery,
  SolicitudDetalle,
  SolicitudResumen,
  UpdateSolicitudDto,
} from '../types/Solicitud';

interface SolicitudStore {
  solicitudes: SolicitudResumen[];
  total: number;
  page: number;
  limit: number;
  filters: FindAllSolicitudesQuery;
  isLoading: boolean;
  error: string | null;
  selectedSolicitud: SolicitudResumen | null;
  detalle: SolicitudDetalle | null;
  isLoadingDetalle: boolean;

  fetchSolicitudes: (params?: FindAllSolicitudesQuery) => Promise<void>;
  fetchDetalle: (id: string) => Promise<void>;
  createSolicitud: (data: CreateSolicitudDto) => Promise<void>;
  updateSolicitud: (id: string, data: UpdateSolicitudDto) => Promise<void>;
  cambiarEstado: (id: string, estado: EstadoSolicitud) => Promise<void>;
  setSelectedSolicitud: (solicitud: SolicitudResumen | null) => void;
  clearDetalle: () => void;
}

export const useSolicitudStore = create<SolicitudStore>((set, get) => ({
  solicitudes: [],
  total: 0,
  page: 1,
  limit: 10,
  filters: {},
  isLoading: false,
  error: null,
  selectedSolicitud: null,
  detalle: null,
  isLoadingDetalle: false,

  // Los parámetros se combinan con los filtros vigentes para que la paginación
  // conserve la búsqueda, el estado y el programa seleccionados
  fetchSolicitudes: async (params = {}) => {
    const filters = { ...get().filters, ...params };
    set({ isLoading: true, error: null, filters });
    try {
      const response = await solicitudApi.getAll({ page: get().page, limit: get().limit, ...filters });
      set({
        solicitudes: response.data,
        total: response.total || 0,
        page: response.page || 1,
        limit: response.limit || 10,
        isLoading: false,
      });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Error al cargar solicitudes', isLoading: false });
    }
  },

  fetchDetalle: async (id) => {
    set({ isLoadingDetalle: true });
    try {
      const detalle = await solicitudApi.getById(id);
      set({ detalle, isLoadingDetalle: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Error al cargar la solicitud',
        isLoadingDetalle: false,
      });
    }
  },

  createSolicitud: async (data) => {
    await solicitudApi.create(data);
    await get().fetchSolicitudes({ page: 1 });
  },

  updateSolicitud: async (id, data) => {
    await solicitudApi.update(id, data);
    set({ selectedSolicitud: null });
    await get().fetchSolicitudes();
    if (get().detalle?.id === id) await get().fetchDetalle(id);
  },

  cambiarEstado: async (id, estado) => {
    await solicitudApi.cambiarEstado(id, estado);
    await get().fetchSolicitudes();
    if (get().detalle?.id === id) await get().fetchDetalle(id);
  },

  setSelectedSolicitud: (solicitud) => set({ selectedSolicitud: solicitud }),
  clearDetalle: () => set({ detalle: null }),
}));
