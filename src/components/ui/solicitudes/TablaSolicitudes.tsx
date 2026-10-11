import { Button, Pagination, Table, Tooltip } from '@heroui/react';
import { Edit, Eye } from 'lucide-react';
import { useSolicitud } from '../../../hooks/useSolicitud';
import type { SolicitudResumen } from '../../../types/Solicitud';
import { formatDate } from '../../../utils/format';
import { EstadoSolicitudChip } from './EstadoSolicitudChip';

const columns = [
  { id: 'codigo', name: 'Código' },
  { id: 'aspirante', name: 'Aspirante' },
  { id: 'programa', name: 'Programa' },
  { id: 'estado', name: 'Estado' },
  { id: 'icfes', name: 'ICFES' },
  { id: 'entrevistas', name: 'Entrevistas' },
  { id: 'fecha', name: 'Creada' },
  { id: 'acciones', name: 'Acciones' },
];

interface TablaSolicitudesProps {
  onView: (solicitud: SolicitudResumen) => void;
  onEdit: (solicitud: SolicitudResumen) => void;
}

export const TablaSolicitudes = ({ onView, onEdit }: TablaSolicitudesProps) => {
  const { solicitudes, total, page, limit, isLoading, fetchSolicitudes } = useSolicitud();

  const totalPages = Math.ceil(total / limit);
  const startResult = total === 0 ? 0 : (page - 1) * limit + 1;
  const endResult = Math.min(page * limit, total);

  if (isLoading && solicitudes.length === 0) {
    return <div className="p-8 text-center text-default-500">Cargando solicitudes...</div>;
  }

  return (
    <Table>
      <Table.ScrollContainer>
        <Table.Content aria-label="Tabla de solicitudes" className="min-w-[960px]">
          <Table.Header columns={columns}>
            {(column) => (
              <Table.Column key={column.id} isRowHeader={column.id === 'aspirante'}>
                {column.name}
              </Table.Column>
            )}
          </Table.Header>

          <Table.Body
            items={solicitudes}
            renderEmptyState={() => (
              <div className="py-8 text-center text-sm text-default-500">
                No hay solicitudes con los filtros seleccionados.
              </div>
            )}
          >
            {(item) => (
              <Table.Row key={item.id}>
                <Table.Cell>
                  <span className="font-mono text-xs text-default-500">
                    {item.codigo.slice(-8).toUpperCase()}
                  </span>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {item.aspirante.nombres} {item.aspirante.apellidos}
                    </span>
                    <span className="text-xs text-default-500">
                      {item.aspirante.tipoDocumento} {item.aspirante.numeroDocumento}
                    </span>
                  </div>
                </Table.Cell>
                <Table.Cell>{item.programa.nombre}</Table.Cell>
                <Table.Cell>
                  <EstadoSolicitudChip estado={item.estado} />
                </Table.Cell>
                <Table.Cell>{item.puntajeIcfes ?? '—'}</Table.Cell>
                <Table.Cell>{item._count.entrevistas}</Table.Cell>
                <Table.Cell>{formatDate(item.createdAt)}</Table.Cell>
                <Table.Cell>
                  <div className="flex items-center gap-2">
                    <Tooltip delay={0}>
                      <Tooltip.Trigger>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="outline"
                          aria-label="Ver detalle"
                          onPress={() => onView(item)}
                        >
                          <Eye size={16} />
                        </Button>
                      </Tooltip.Trigger>
                      <Tooltip.Content>
                        <p>Ver detalle</p>
                      </Tooltip.Content>
                    </Tooltip>
                    <Tooltip delay={0}>
                      <Tooltip.Trigger>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="outline"
                          aria-label="Editar"
                          onPress={() => onEdit(item)}
                        >
                          <Edit size={16} />
                        </Button>
                      </Tooltip.Trigger>
                      <Tooltip.Content>
                        <p>Editar</p>
                      </Tooltip.Content>
                    </Tooltip>
                  </div>
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>

      {totalPages > 1 && (
        <Table.Footer>
          <Pagination size="sm">
            <Pagination.Summary>
              {startResult} a {endResult} de {total} resultados
            </Pagination.Summary>
            <Pagination.Content>
              <Pagination.Item>
                <Pagination.Previous
                  isDisabled={page === 1}
                  onPress={() => void fetchSolicitudes({ page: Math.max(1, page - 1) })}
                >
                  <Pagination.PreviousIcon />
                  Anterior
                </Pagination.Previous>
              </Pagination.Item>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                <Pagination.Item key={pageNumber}>
                  <Pagination.Link
                    isActive={pageNumber === page}
                    onPress={() => void fetchSolicitudes({ page: pageNumber })}
                  >
                    {pageNumber}
                  </Pagination.Link>
                </Pagination.Item>
              ))}
              <Pagination.Item>
                <Pagination.Next
                  isDisabled={page === totalPages}
                  onPress={() => void fetchSolicitudes({ page: Math.min(totalPages, page + 1) })}
                >
                  Siguiente
                  <Pagination.NextIcon />
                </Pagination.Next>
              </Pagination.Item>
            </Pagination.Content>
          </Pagination>
        </Table.Footer>
      )}
    </Table>
  );
};
