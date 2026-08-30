import { useUsuarioStore } from '../stores/usuarioStore';

export const useUsuario = () => {
  const usuarios = useUsuarioStore((state) => state.usuarios);
  const isLoading = useUsuarioStore((state) => state.isLoading);
  const error = useUsuarioStore((state) => state.error);
  const selectedUsuario = useUsuarioStore((state) => state.selectedUsuario);
  
  const fetchUsuarios = useUsuarioStore((state) => state.fetchUsuarios);
  const createUsuario = useUsuarioStore((state) => state.createUsuario);
  const updateUsuario = useUsuarioStore((state) => state.updateUsuario);
  const deleteUsuario = useUsuarioStore((state) => state.deleteUsuario);
  const setSelectedUsuario = useUsuarioStore((state) => state.setSelectedUsuario);

  return { 
    usuarios, isLoading, error, selectedUsuario, 
    fetchUsuarios, createUsuario, updateUsuario, deleteUsuario, setSelectedUsuario 
  };
};