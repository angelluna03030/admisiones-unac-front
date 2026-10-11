import { useDocumentoStore } from '../stores/documentoStore';

export const useDocumento = () => {
  const documentos = useDocumentoStore((state) => state.documentos);
  const filters = useDocumentoStore((state) => state.filters);
  const isLoading = useDocumentoStore((state) => state.isLoading);
  const error = useDocumentoStore((state) => state.error);
  const selectedDocumento = useDocumentoStore((state) => state.selectedDocumento);

  const fetchDocumentos = useDocumentoStore((state) => state.fetchDocumentos);
  const createDocumento = useDocumentoStore((state) => state.createDocumento);
  const updateDocumento = useDocumentoStore((state) => state.updateDocumento);
  const cambiarEstado = useDocumentoStore((state) => state.cambiarEstado);
  const deleteDocumento = useDocumentoStore((state) => state.deleteDocumento);
  const setSelectedDocumento = useDocumentoStore((state) => state.setSelectedDocumento);

  return {
    documentos,
    filters,
    isLoading,
    error,
    selectedDocumento,
    fetchDocumentos,
    createDocumento,
    updateDocumento,
    cambiarEstado,
    deleteDocumento,
    setSelectedDocumento,
  };
};
