import { useState, useEffect } from 'react';
import { UserPlus, Users } from 'lucide-react';
import { Button, Input } from '@heroui/react';
import { TablaAspirantes } from '../components/ui/aspirantes/TablaAspirantes';
import { AspiranteModal } from '../components/ui/aspirantes/AspiranteModal';
import { useAspirante } from '../hooks/useAspirante';

export const AspirantesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { total, fetchAspirantes, setSelectedAspirante } = useAspirante();

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchAspirantes({ search: searchTerm.trim() || undefined, page: 1, limit: 10 });
    }, 400);
    return () => clearTimeout(timeout);
  }, [searchTerm, fetchAspirantes]);

  const handleOpenCreate = () => {
    setSelectedAspirante(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary-100 text-primary-600 shrink-0">
            <Users size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Aspirantes</h1>
            <p className="text-default-500 text-sm mt-0.5">Gestiona la información de los aspirantes registrados. <span className="ml-1 text-default-400">· {total} registrados</span></p>
          </div>
        </div>
        <Button onPress={handleOpenCreate}> <UserPlus size={18} /> Nuevo Aspirante</Button>
      </div>

      <div className="bg-default-50 p-4 rounded-xl border border-default-200">
        <Input placeholder="Buscar por nombre, apellido o documento..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="max-w-md" />
      </div>

      <div className="bg-background rounded-xl border border-default-200 p-4">
        <TablaAspirantes />
      </div>

      <AspiranteModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};