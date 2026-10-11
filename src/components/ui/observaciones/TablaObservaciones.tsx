import { Button, Chip, Table, Tooltip } from '@heroui/react';
import { CheckCircle2, Edit, RotateCcw, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { useObservacion } from '../../../hooks/useObservacion';
import type { Observacion } from '../../../types/Observacion';
import { getEstadoSolicitud } from '../../../types/Solicitud';
import { formatDateTime } from '../../../utils/format';

const columns = [
  { id: 'aspirante', name: 'Aspirante' },
  { id: 'motivo', name: 'Observación' },
  { id: 'emitida', name: 'Emitida por' },
  { id: 'estado', name: 'Estado' },
  { id: 'solicitud', name: 'Estado solicitud' },
  { id: 'acciones', name: 'Acciones' },
];

interface TablaObservacionesProps {
  items: Observacion[];
  puedeEditar: boolean;
  onEdit: (observacion: Observacion) => void;
}

export const TablaObservaciones = ({ items, puedeEditar, onEdit }: TablaObservacionesProps) => {
  const { isLoading, resolverObservacion, deleteObservacion } = useObservacion();

  const nombre = (o: Observacion) => `${o.solicitud.aspirante.nombres} ${o.solicitud.aspirante.apellidos}`;

  const handleResolver = async (observacion: Observacion) => {
    const resolver = !observacion.resuelta;
    const result = await Swal.fire({
      title: resolver ? '¿Marcar como resuelta?' : '¿Reabrir observación?',
      text: resolver
        ? 'Si es la última observación abierta, la solicitud vuelve a Validación de requisitos.'
        : 'La solicitud volverá a quedar Observada.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: resolver ? '#10b981' : '#f59e0b',
      cancelButtonColor: '#6b7280',
      confirmButtonText: resolver ? 'Sí, resolver' : 'Sí, reabrir',
      cancelButtonText: 'Cancelar',
    });
    if (!result.isConfirmed) return;

    try {
      await resolverObservacion(observacion.id, resolver);
      Swal.fire({ icon: 'success', title: resolver ? 'Resuelta' : 'Reabierta', timer: 1500, showConfirmButton: false });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      Swal.fire({ icon: 'error', title: 'Error', text: error.response?.data?.message || 'No se pudo actualizar.' });
    }
  };

  const handleDelete = async (observacion: Observacion) => {
    const result = await Swal.fire({
      title: '¿Eliminar observación?',
      text: `Se eliminará "${observacion.motivo}" de ${nombre(observacion)}. El estado de la solicitud no cambia.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });
    if (!result.isConfirmed) return;

    try {
      await deleteObservacion(observacion.id);
      Swal.fire({ icon: 'success', title: 'Eliminada', timer: 1500, showConfirmButton: false });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      Swal.fire({ icon: 'error', title: 'Error', text: error.response?.data?.message || 'No se pudo eliminar.' });
    }
  };

  if (isLoading && items.length === 0) {
    return <div className="p-8 text-center text-default-500">Cargando observaciones...</div>;
  }

  return (
    <Table>
      <Table.ScrollContainer>
        <Table.Content aria-label="Tabla de observaciones de Admisiones" className="min-w-[960px]">
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
                No hay observaciones con los filtros seleccionados.
              </div>
            )}
          >
            {(item) => {
              const estadoSolicitud = getEstadoSolicitud(item.solicitud.estado);
              return (
                <Table.Row key={item.id}>
                  <Table.Cell>
                    <div className="flex flex-col">
                      <span className="font-medium">{nombre(item)}</span>
                      <span className="text-xs text-default-500">
                        {item.solicitud.aspirante.numeroDocumento} · {item.solicitud.programa.nombre}
                      </span>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex max-w-[260px] flex-col">
                      <span className="font-medium">{item.motivo}</span>
                      {item.detalle && (
                        <span className="truncate text-xs text-default-500" title={item.detalle}>
                          {item.detalle}
                        </span>
                      )}
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex flex-col">
                      <span className="text-sm">
                        {item.emitidaPor.nombres} {item.emitidaPor.apellidos}
                      </span>
                      <span className="text-xs text-default-500">{formatDateTime(item.createdAt)}</span>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <Chip size="sm" variant="soft" color={item.resuelta ? 'success' : 'warning'}>
                      {item.resuelta ? 'Resuelta' : 'Abierta'}
                    </Chip>
                  </Table.Cell>
                  <Table.Cell>
                    <Chip size="sm" variant="soft" color={estadoSolicitud.color}>
                      {estadoSolicitud.label}
                    </Chip>
                  </Table.Cell>
                  <Table.Cell>
                    {puedeEditar ? (
                      <div className="flex items-center gap-2">
                        <Tooltip delay={0}>
                          <Tooltip.Trigger>
                            <Button
                              isIconOnly
                              size="sm"
                              variant="outline"
                              aria-label={item.resuelta ? 'Reabrir' : 'Marcar como resuelta'}
                              onPress={() => handleResolver(item)}
                            >
                              {item.resuelta ? <RotateCcw size={16} /> : <CheckCircle2 size={16} />}
                            </Button>
                          </Tooltip.Trigger>
                          <Tooltip.Content>
                            <p>{item.resuelta ? 'Reabrir' : 'Marcar como resuelta'}</p>
                          </Tooltip.Content>
                        </Tooltip>
                        <Tooltip delay={0}>
                          <Tooltip.Trigger>
                            <Button isIconOnly size="sm" variant="outline" aria-label="Editar" onPress={() => onEdit(item)}>
                              <Edit size={16} />
                            </Button>
                          </Tooltip.Trigger>
                          <Tooltip.Content>
                            <p>Editar</p>
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
                    ) : (
                      <span className="text-xs text-default-400">Solo lectura</span>
                    )}
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
