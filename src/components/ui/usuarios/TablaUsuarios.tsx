import { Table, Button, Chip, Tooltip } from '@heroui/react';
import { Edit, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import Swal from 'sweetalert2';
import { useUsuario } from '../../../hooks/useUsuario';
import type { Usuario } from '../../../types/Usuario';

// 1. Definimos las props que recibe la tabla
interface TablaUsuariosProps {
    items: Usuario[]; // ✅ CORREGIDO: coincide con la interfaz TablaUsuariosProps
  onEdit: () => void; // Función para avisar al padre que abra el modal
}

export const TablaUsuarios = ({ onEdit }: TablaUsuariosProps) => {
  const { usuarios, isLoading, setSelectedUsuario, deleteUsuario } = useUsuario();

  // 2. Al hacer clic en editar, guardamos el usuario y avisamos al padre
  const handleEdit = (usuario: Usuario) => {
    setSelectedUsuario(usuario); 
    onEdit();                    // Esto ejecutará setIsModalOpen(true) en UsuariosPage
  };

  const handleDelete = async (id: string, nombre: string) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `Se desactivará al usuario "${nombre}". Esta acción se puede revertir reactivándolo.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, desactivar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      try {
        await deleteUsuario(id);
        Swal.fire({ 
          icon: 'success', 
          title: 'Desactivado', 
          text: 'El usuario ha sido desactivado correctamente.', 
          timer: 2000, 
          showConfirmButton: false 
        });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        Swal.fire({ 
          icon: 'error', 
          title: 'Error', 
          text: error.response?.data?.message || 'No se pudo desactivar el usuario.' 
        });
      }
    }
  };

  const columns = [
    { id: 'nombre', label: 'Nombre Completo' },
    { id: 'correo', label: 'Correo' },
    { id: 'rol', label: 'Rol' },
    { id: 'estado', label: 'Estado' },
    { id: 'acciones', label: 'Acciones' },
  ];

  const getRolColor = (rol: string) => {
    const colors: Record<string, 'default' | 'accent' | 'success' | 'warning' | 'danger'> = {
      ADMIN: 'danger',
      VICERRECTORIA: 'warning',
      COORDINADOR_PROGRAMA: 'accent',
      ADMISIONES: 'success',
      CAPELLAN: 'default',
      OFICINA_FINANCIERA: 'default',
      REGISTRO_ACADEMICO: 'default',
    };
    return colors[rol] || 'default';
  };

  if (isLoading) {
    return <div className="p-8 text-center text-default-500">Cargando usuarios...</div>;
  }

  return (
    <Table>
      <Table.ScrollContainer>
        <Table.Content
          aria-label="Tabla de usuarios"
          className="[&_tbody_tr:nth-child(odd)]:bg-default-100/50"
        >
          <Table.Header columns={columns}>
            {(column) => <Table.Column id={column.id}>{column.label}</Table.Column>}
          </Table.Header>
          <Table.Body
            items={usuarios}
            renderEmptyState={() => (
              <p className="text-center py-8 text-default-500">No hay usuarios registrados.</p>
            )}
          >
            {/* 3. Tipamos 'item' correctamente como Usuario */}
            {(item: Usuario) => (
              <Table.Row id={item.id}>
                <Table.Cell className="font-medium">{item.nombres} {item.apellidos}</Table.Cell>
                <Table.Cell>{item.correo}</Table.Cell>
                <Table.Cell>
                  <Chip color={getRolColor(item.rol)} size="sm" variant="soft">
                    {item.rol.replace('_', ' ')}
                  </Chip>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex items-center gap-2">
                    {item.activo ? (
                      <CheckCircle2 size={16} className="text-success" />
                    ) : (
                      <XCircle size={16} className="text-default-400" />
                    )}
                    <span className={item.activo ? 'text-success' : 'text-default-400'}>
                      {item.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex items-center gap-2">
                    <Tooltip delay={0}>
                      <Tooltip.Trigger>
                        <Button 
                          isIconOnly 
                          size="sm" 
                          variant="outline" 
              
                          onPress={() => handleEdit(item)}
                        >
                          <Edit size={16} />
                        </Button>
                      </Tooltip.Trigger>
                      <Tooltip.Content>
                        <p>Editar</p>
                      </Tooltip.Content>
                    </Tooltip>

                    <Tooltip delay={0}>
                      <Tooltip.Trigger>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="outline"
                    
                          aria-label={item.activo ? 'Desactivar' : 'Activar'}
                          onPress={() => handleDelete(item.id, `${item.nombres} ${item.apellidos}`)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </Tooltip.Trigger>
                      <Tooltip.Content>
                        <p>{item.activo ? 'Desactivar' : 'Activar'}</p>
                      </Tooltip.Content>
                    </Tooltip>
                  </div>
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
};