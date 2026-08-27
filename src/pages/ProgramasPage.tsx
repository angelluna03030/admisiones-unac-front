import { useState, useEffect } from 'react';
import { BookOpen, Plus } from 'lucide-react';
import { Button, Input } from '@heroui/react';
import { TablaProgramas } from '../components/ui/programas/TablaProgramas';
import { ProgramaModal } from '../components/ui/programas/ProgramaModal';
import { usePrograma } from '../hooks/usePrograma';

export const ProgramasPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { total, fetchProgramas, setSelectedPrograma } = usePrograma();

  // Debounce para la búsqueda
  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchProgramas({ search: searchTerm.trim() || undefined, page: 1, limit: 10 });
    }, 400);
    return () => clearTimeout(timeout);
  }, [searchTerm, fetchProgramas]);

  const handleOpenCreate = () => {
    setSelectedPrograma(null); // Asegurar que esté en modo creación
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary-100 text-primary-600 shrink-0">
            <BookOpen size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Programas Académicos</h1>
            <p className="text-default-500 text-sm mt-0.5">
              Administra la oferta académica de la institución.
              <span className="ml-1 text-default-400">· {total} registrados</span>
            </p>
          </div>
        </div>
        <Button   onPress={handleOpenCreate}>
            <Plus size={18} />
          Nuevo Programa
        </Button>
      </div>

      {/* Filtros */}
      <div className="bg-default-50 p-4 rounded-xl border border-default-200">
        <Input
          placeholder="Buscar por nombre o código..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />

      </div>

      {/* Tabla */}
      <div className="bg-background rounded-xl border border-default-200 p-4">
        <TablaProgramas />
      </div>

      {/* Modal */}
      <ProgramaModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};