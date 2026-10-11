import { Button, Chip, Table, Tooltip } from '@heroui/react';
import { CheckCircle2, Edit, ExternalLink, Trash2, XCircle } from 'lucide-react';
import Swal from 'sweetalert2';
import { useDocumento } from '../../../hooks/useDocumento';
import { getEstadoDocumento, getTipoDocumento, type Documento } from '../../../types/Documento';
import { formatDateTime } from '../../../utils/format';

const columns = [
  { id: 'aspirante', name: 'Aspirante' },
  { id: 'tipo', name: 'Documento' },
  { id: 'archivo', name: 'Archivo' },
  { id: 'estado', name: 'Estado' },
  { id: 'fechas', name: 'Cargado / Validado' },
  { id: 'observacion', name: 'Observación' },
  { id: 'acciones', name: 'Acciones' },
];

interface TablaDocumentosProps {
  items: Documento[];
  onEdit: (documento: Documento) => void;
}

const errorMensaje = (error: unknown, fallback: string) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (error as any)?.response?.data?.message || fallback;

export const TablaDocumentos = ({ items, onEdit }: TablaDocumentosProps) => {
  const { isLoading, cambiarEstado, deleteDocumento } = useDocumento();

  const nombre = (d: Documento) => `${d.solicitud.aspirante.nombres} ${d.solicitud.aspirante.apellidos}`;

  const handleValidar = async (documento: Documento) => {
    const result = await Swal.fire({
      title: '¿Validar documento?',
      text: `${getTipoDocumento(documento.tipo)} de ${nombre(documento)}.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, validar',
      cancelButtonText: 'Cancelar',
    });
    if (!result.isConfirmed) return;

    try {
      await cambiarEstado(documento.id, 'VALIDADO');
      Swal.fire({ icon: 'success', title: 'Documento validado', timer: 1600, showConfirmButton: false });
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error', text: errorMensaje(error, 'No se pudo validar el documento.') });
    }
  };

  const handleRechazar = async (documento: Documento) => {
    const result = await Swal.fire({
      title: 'Rechazar documento',
      text: `${getTipoDocumento(documento.tipo)} de ${nombre(documento)}. El aspirante deberá cargarlo de nuevo.`,
      input: 'textarea',
      inputPlaceholder: 'Motivo del rechazo (ej. documento ilegible, vencido...)',
      inputValue: documento.estado === 'RECHAZADO' ? documento.observacion ?? '' : '',
      inputValidator: (value) => (!value?.trim() ? 'Indica el motivo del rechazo' : undefined),
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Rechazar',
      cancelButtonText: 'Cancelar',
    });
    if (!result.isConfirmed) return;

    try {
      await cambiarEstado(documento.id, 'RECHAZADO', String(result.value).trim());
      Swal.fire({ icon: 'success', title: 'Documento rechazado', timer: 1600, showConfirmButton: false });
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error', text: errorMensaje(error, 'No se pudo rechazar el documento.') });
    }
  };

  const handleDelete = async (documento: Documento) => {
    const result = await Swal.fire({
      title: '¿Eliminar documento?',
      text: `Se eliminará el registro de ${getTipoDocumento(documento.tipo)} de ${nombre(documento)}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });
    if (!result.isConfirmed) return;

    try {
      await deleteDocumento(documento.id);
      Swal.fire({ icon: 'success', title: 'Eliminado', timer: 1600, showConfirmButton: false });
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error', text: errorMensaje(error, 'No se pudo eliminar el documento.') });
    }
  };

  if (isLoading && items.length === 0) {
    return <div className="p-8 text-center text-default-500">Cargando documentos...</div>;
  }

  return (
    <Table>
      <Table.ScrollContainer>
        <Table.Content aria-label="Tabla de documentos" className="min-w-[1000px]">
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
                No hay documentos con los filtros seleccionados.
              </div>
            )}
          >
            {(item) => {
              const estado = getEstadoDocumento(item.estado);
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
                  <Table.Cell>{getTipoDocumento(item.tipo)}</Table.Cell>
                  <Table.Cell>
                    {item.urlArchivo ? (
                      <a
                        href={item.urlArchivo}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-accent hover:underline"
                      >
                        Ver archivo <ExternalLink size={14} />
                      </a>
                    ) : (
                      <span className="text-sm text-warning">Sin archivo</span>
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <Chip size="sm" variant="soft" color={estado.color}>
                      {estado.label}
                    </Chip>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex flex-col text-xs">
                      <span>{formatDateTime(item.cargadoEn)}</span>
                      <span className="text-default-500">{formatDateTime(item.validadoEn)}</span>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      className={`block max-w-[200px] truncate text-sm ${item.estado === 'RECHAZADO' ? 'text-danger' : 'text-default-600'}`}
                      title={item.observacion ?? undefined}
                    >
                      {item.observacion || '—'}
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center gap-2">
                      <Tooltip delay={0}>
                        <Tooltip.Trigger>
                          <Button
                            isIconOnly
                            size="sm"
                            variant="outline"
                            aria-label="Validar"
                            isDisabled={item.estado === 'VALIDADO' || !item.urlArchivo}
                            onPress={() => handleValidar(item)}
                          >
                            <CheckCircle2 size={16} />
                          </Button>
                        </Tooltip.Trigger>
                        <Tooltip.Content>
                          <p>{item.urlArchivo ? 'Validar' : 'Carga el archivo para poder validarlo'}</p>
                        </Tooltip.Content>
                      </Tooltip>
                      <Tooltip delay={0}>
                        <Tooltip.Trigger>
                          <Button
                            isIconOnly
                            size="sm"
                            variant="outline"
                            aria-label="Rechazar"
                            isDisabled={item.estado === 'PENDIENTE'}
                            onPress={() => handleRechazar(item)}
                          >
                            <XCircle size={16} />
                          </Button>
                        </Tooltip.Trigger>
                        <Tooltip.Content>
                          <p>Rechazar</p>
                        </Tooltip.Content>
                      </Tooltip>
                      <Tooltip delay={0}>
                        <Tooltip.Trigger>
                          <Button isIconOnly size="sm" variant="outline" aria-label="Editar" onPress={() => onEdit(item)}>
                            <Edit size={16} />
                          </Button>
                        </Tooltip.Trigger>
                        <Tooltip.Content>
                          <p>Cargar archivo / editar</p>
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
