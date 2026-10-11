import { create } from 'zustand';
import { authApi, type UsuarioSesion } from '../api/auth';
import { SESION_EXPIRADA } from '../api/apiClient';

type EstadoSesion = 'verificando' | 'autenticado' | 'anonimo';

interface AuthStore {
  usuario: UsuarioSesion | null;
  estado: EstadoSesion;
  verificarSesion: () => Promise<void>;
  login: (correo: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  usuario: null,
  estado: 'verificando',

  verificarSesion: async () => {
    if (get().estado === 'autenticado') return;
    try {
      const usuario = await authApi.me();
      set({ usuario, estado: 'autenticado' });
    } catch {
      set({ usuario: null, estado: 'anonimo' });
    }
  },

  login: async (correo, password) => {
    const usuario = await authApi.login(correo, password);
    set({ usuario, estado: 'autenticado' });
  },

  logout: async () => {
    try {
      await authApi.logout();
    } finally {
      set({ usuario: null, estado: 'anonimo' });
    }
  },
}));

// Si el backend responde 401 en cualquier petición, la sesión expiró
if (typeof window !== 'undefined') {
  window.addEventListener(SESION_EXPIRADA, () => {
    if (useAuthStore.getState().estado === 'autenticado') {
      useAuthStore.setState({ usuario: null, estado: 'anonimo' });
    }
  });
}
