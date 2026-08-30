import { useState, useEffect } from 'react';
import { UserPlus, Users } from 'lucide-react';
import { Button, Input } from '@heroui/react';
import { TablaUsuarios } from '../components/ui/usuarios/TablaUsuarios';
import { UsuarioModal } from '../components/ui/usuarios/UsuarioModal';
import { useUsuario } from '../hooks/useUsuario'; // <-- Importación agregada

export const UsuariosPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { usuarios, fetchUsuarios, setSelectedUsuario } = useUsuario();

  useEffect(() => {
    fetchUsuarios();
  }, [fetchUsuarios]);

  const handleOpenCreate = () => {
    setSelectedUsuario(null);
    setIsModalOpen(true);
  };

  // Filtro en tiempo real en el frontend
  const filteredUsuarios = usuarios.filter(u => 
    u.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.correo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary-100 text-primary-600 shrink-0">
            <Users size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Usuarios del Sistema</h1>
            <p className="text-default-500 text-sm mt-0.5">
              Gestiona los funcionarios y sus roles. <span className="ml-1 text-default-400">· {usuarios.length} registrados</span>
            </p>
          </div>
        </div>
        <Button variant="outline" onPress={handleOpenCreate}> 
          <UserPlus size={18} /> Nuevo Usuario
        </Button>
      </div>

      <div className="bg-default-50 p-4 rounded-xl border border-default-200">
        <Input 
          placeholder="Buscar por nombre, apellido o correo..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md" 
        />
      </div>

         <div className="bg-background rounded-xl border border-default-200 p-4">
        {/* Pasamos los datos filtrados como 'items' y la función onEdit */}
        <TablaUsuarios 
          items={filteredUsuarios} // ✅ CORREGIDO: coincide con la interfaz TablaUsuariosProps
          onEdit={() => setIsModalOpen(true)} 
        />
      </div>

      <UsuarioModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};