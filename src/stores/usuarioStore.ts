/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { usuarioApi } from '../api/usuario';
import type { Usuario, CreateUsuarioDto, UpdateUsuarioDto } from '../types/Usuario';

interface UsuarioStore {
  usuarios: Usuario[];
  isLoading: boolean;
  error: string | null;
  selectedUsuario: Usuario | null;

  fetchUsuarios: () => Promise<void>;
  createUsuario: (data: CreateUsuarioDto) => Promise<void>;
  updateUsuario: (id: string, data: UpdateUsuarioDto) => Promise<void>;
  deleteUsuario: (id: string) => Promise<void>;
  setSelectedUsuario: (usuario: Usuario | null) => void;
}

export const useUsuarioStore = create<UsuarioStore>((set, get) => ({
  usuarios: [],
  isLoading: false,
  error: null,
  selectedUsuario: null,

  fetchUsuarios: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await usuarioApi.getAll();
      set({ usuarios: response.data || [], isLoading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Error al cargar usuarios', isLoading: false });
    }
  },

  createUsuario: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await usuarioApi.create(data);
      set({ isLoading: false });
      await get().fetchUsuarios();
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Error al crear usuario', isLoading: false });
      throw error;
    }
  },

  updateUsuario: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      await usuarioApi.update(id, data);
      set({ isLoading: false, selectedUsuario: null });
      await get().fetchUsuarios();
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Error al actualizar usuario', isLoading: false });
      throw error;
    }
  },

  deleteUsuario: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await usuarioApi.delete(id);
      set({ isLoading: false });
      await get().fetchUsuarios();
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Error al eliminar usuario', isLoading: false });
      throw error;
    }
  },

  setSelectedUsuario: (usuario) => set({ selectedUsuario: usuario }),
}));