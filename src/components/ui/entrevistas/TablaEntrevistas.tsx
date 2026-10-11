import { Button, Chip, Table, Tooltip } from '@heroui/react';
import { ClipboardCheck, Edit, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { useEntrevista } from '../../../hooks/useEntrevista';
import { ESTADOS_ENTREVISTA, TIPOS_ENTREVISTA, type Entrevista } from '../../../types/Entrevista';
import { formatDateTime } from '../../../utils/format';

const columns = [
  { id: 'fecha', name: 'Fecha' },
  { id: 'aspirante', name: 'Aspirante' },
  { id: 'tipo', name: 'Tipo' },
  { id: 'evaluador', name: 'Evaluador' },
  { id: 'modalidad', name: 'Modalidad' },
  { id: 'estado', name: 'Estado' },
  { id: 'puntaje', name: 'Puntaje' },
  { id: 'acciones', name: 'Acciones' },
];

interface TablaEntrevistasProps {
  items: Entrevista[];
  onEdit: (entrevista: Entrevista) => void;
  onEvaluate: (entrevista: Entrevista) => void;
}

export const TablaEntrevistas = ({ items, onEdit, onEvaluate }: TablaEntrevistasProps) => {
  const { isLoading, deleteEntrevista } = useEntrevista();

  const handleDelete = async (entrevista: Entrevista) => {
    const result = await Swal.fire({
      title: '¿Eliminar entrevista?',
      text: `Se eliminará la entrevista de ${entrevista.solicitud.aspirante.nombres} ${entrevista.solicitud.aspirante.apellidos} y su evaluación, si existe. Si solo no se va a realizar, cámbiala a "Cancelada".`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });
    if (!result.isConfirmed) return;

    try {
      await deleteEntrevista(entrevista.id);
      Swal.fire({ icon: 'success', title: 'Eliminada', timer: 1800, showConfirmButton: false });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'No se pudo eliminar la entrevista.',
      });
    }
  };

  if (isLoading && items.length === 0) {
    return <div className="p-8 text-center text-default-500">Cargando entrevistas...</div>;
  }

  return (
    <Table>
      <Table.ScrollContainer>
        <Table.Content aria-label="Tabla de entrevistas" className="min-w-[960px]">
          <Table.Header columns={columns}>
            {(column) => (
              <Table.Column key={column.id} isRowHeader={column.id === 'aspirante'}>
                {column.name}
              </Table.Column>
            )}
          </Table.Header>

          <Table.Body
            items={items}
            renderEmptyState={() => (
              <div className="py-8 text-center text-sm text-default-500">
                No hay entrevistas con los filtros seleccionados.
              </div>
            )}
          >
            {(item) => {
              const estado = ESTADOS_ENTREVISTA.find((e) => e.id === item.estado);
              const promedio = item.evaluacionCapellania?.promedio ?? item.evaluacionAcademica?.promedio;
              const vencida =
                (item.estado === 'PENDIENTE' || item.estado === 'REPROGRAMADA') &&
                !!item.fechaProgramada &&
                new Date(item.fechaProgramada) < new Date();

              return (
                <Table.Row key={item.id}>
                  <Table.Cell>
                    <span className={vencida ? 'text-danger' : ''}>{formatDateTime(item.fechaProgramada)}</span>
                    {vencida && <p className="text-xs text-danger">Vencida</p>}
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {item.solicitud.aspirante.nombres} {item.solicitud.aspirante.apellidos}
                      </span>
                      <span className="text-xs text-default-500">{item.solicitud.programa.nombre}</span>
                    </div>
                  </Table.Cell>
                  <Table.Cell>{TIPOS_ENTREVISTA.find((t) => t.id === item.tipo)?.label}</Table.Cell>
                  <Table.Cell>
                    {item.evaluador ? (
                      `${item.evaluador.nombres} ${item.evaluador.apellidos}`
                    ) : (
                      <span className="text-warning">Sin asignar</span>
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex flex-col">
                      <span>{item.modalidad ?? '—'}</span>
                      {item.lugarOEnlace && (
                        <span className="max-w-[160px] truncate text-xs text-default-500">{item.lugarOEnlace}</span>
                      )}
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <Chip size="sm" variant="soft" color={estado?.color ?? 'default'}>
                      {estado?.label ?? item.estado}
                    </Chip>
                  </Table.Cell>
                  <Table.Cell>{promedio ? `${Number(promedio).toFixed(1)} / 5` : '—'}</Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center gap-2">
                      <Tooltip delay={0}>
                        <Tooltip.Trigger>
                          <Button
                            isIconOnly
                            size="sm"
                            variant="outline"
                            aria-label="Evaluar"
                            isDisabled={item.estado === 'CANCELADA'}
                            onPress={() => onEvaluate(item)}
                          >
                            <ClipboardCheck size={16} />
                          </Button>
                        </Tooltip.Trigger>
                        <Tooltip.Content>
                          <p>{promedio ? 'Corregir evaluación' : 'Registrar evaluación'}</p>
                        </Tooltip.Content>
                      </Tooltip>
                      <Tooltip delay={0}>
                        <Tooltip.Trigger>
                          <Button isIconOnly size="sm" variant="outline" aria-label="Editar" onPress={() => onEdit(item)}>
                            <Edit size={16} />
                          </Button>
                        </Tooltip.Trigger>
                        <Tooltip.Content>
                          <p>Editar / reprogramar</p>
                        </Tooltip.Content>
                      </Tooltip>
                      <Tooltip delay={0}>
                        <Tooltip.Trigger>
                          <Button isIconOnly size="sm" variant="outline" aria-label="Eliminar" onPress={() => handleDelete(item)}>
                            <Trash2 size={16} />
                          </Button>
                        </Tooltip.Trigger>
                        <Tooltip.Content>
                          <p>Eliminar</p>
                        </Tooltip.Content>
                      </Tooltip>
                    </div>
                  </Table.Cell>
                </Table.Row>
              );
            }}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
};
