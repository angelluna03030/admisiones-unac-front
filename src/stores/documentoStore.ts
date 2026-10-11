/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { documentoApi } from '../api/documento';
import type {
  CreateDocumentoDto,
  Documento,
  EstadoDocumento,
  FindAllDocumentosQuery,
  UpdateDocumentoDto,
} from '../types/Documento';

interface DocumentoStore {
  documentos: Documento[];
  filters: FindAllDocumentosQuery;
  isLoading: boolean;
  error: string | null;
  selectedDocumento: Documento | null;

  fetchDocumentos: (filters?: FindAllDocumentosQuery) => Promise<void>;
  createDocumento: (data: CreateDocumentoDto) => Promise<void>;
  updateDocumento: (id: string, data: UpdateDocumentoDto) => Promise<void>;
  cambiarEstado: (id: string, estado: EstadoDocumento, observacion?: string | null) => Promise<void>;
  deleteDocumento: (id: string) => Promise<void>;
  setSelectedDocumento: (documento: Documento | null) => void;
}

export const useDocumentoStore = create<DocumentoStore>((set, get) => ({
  documentos: [],
  filters: {},
  isLoading: false,
  error: null,
  selectedDocumento: null,

  fetchDocumentos: async (filters) => {
    const activeFilters = filters ?? get().filters;
    set({ isLoading: true, error: null, filters: activeFilters });
    try {
      const response = await documentoApi.getAll(activeFilters);
      set({ documentos: response.data || [], isLoading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Error al cargar documentos', isLoading: false });
    }
  },

  createDocumento: async (data) => {
    await documentoApi.create(data);
    await get().fetchDocumentos();
  },

  updateDocumento: async (id, data) => {
    await documentoApi.update(id, data);
    set({ selectedDocumento: null });
    await get().fetchDocumentos();
  },

  cambiarEstado: async (id, estado, observacion) => {
    await documentoApi.cambiarEstado(id, estado, observacion);
    await get().fetchDocumentos();
  },

  deleteDocumento: async (id) => {
    await documentoApi.delete(id);
    await get().fetchDocumentos();
  },

  setSelectedDocumento: (documento) => set({ selectedDocumento: documento }),
}));
