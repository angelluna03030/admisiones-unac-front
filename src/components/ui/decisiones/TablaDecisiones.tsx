import { Button, Chip, Table, Tooltip } from '@heroui/react';
import { Edit, Stamp, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { useDecision } from '../../../hooks/useDecision';
import {
  getEstadoRatificacion,
  getTipoDecision,
  promedioEntrevista,
  type Decision,
} from '../../../types/Decision';
import { getEstadoSolicitud } from '../../../types/Solicitud';
import { formatDateTime } from '../../../utils/format';

const columns = [
  { id: 'aspirante', name: 'Aspirante' },
  { id: 'entrevistas', name: 'Entrevistas' },
  { id: 'decision', name: 'Decisión' },
  { id: 'tomadaPor', name: 'Tomada por' },
  { id: 'ratificacion', name: 'Ratificación' },
  { id: 'solicitud', name: 'Estado solicitud' },
  { id: 'acciones', name: 'Acciones' },
];

interface TablaDecisionesProps {
  items: Decision[];
  onEdit: (decision: Decision) => void;
  onRatificar: (decision: Decision) => void;
}

const Puntaje = ({ label, valor }: { label: string; valor: number | null }) => (
  <span className="text-xs">
    <span className="text-default-500">{label}:</span>{' '}
    {valor === null ? (
      <span className="text-default-400">—</span>
    ) : (
      <span className={`font-medium ${valor >= 4 ? 'text-success' : valor >= 3 ? 'text-warning' : 'text-danger'}`}>
        {valor.toFixed(1)}
      </span>
    )}
  </span>
);

export const TablaDecisiones = ({ items, onEdit, onRatificar }: TablaDecisionesProps) => {
  const { isLoading, deleteDecision } = useDecision();

  const handleDelete = async (decision: Decision) => {
    const result = await Swal.fire({
      title: '¿Eliminar decisión?',
      text: `Se eliminará la decisión sobre ${decision.solicitud.aspirante.nombres} ${decision.solicitud.aspirante.apellidos}. El estado de la solicitud no se revierte automáticamente.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });
    if (!result.isConfirmed) return;

    try {
      await deleteDecision(decision.id);
      Swal.fire({ icon: 'success', title: 'Eliminada', timer: 1600, showConfirmButton: false });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'No se pudo eliminar la decisión.',
      });
    }
  };

  if (isLoading && items.length === 0) {
    return <div className="p-8 text-center text-default-500">Cargando decisiones...</div>;
  }

  return (
    <Table>
      <Table.ScrollContainer>
        <Table.Content aria-label="Tabla de decisiones de admisión" className="min-w-[1050px]">
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
                No hay decisiones con los filtros seleccionados.
              </div>
            )}
          >
            {(item) => {
              const tipo = getTipoDecision(item.tipo);
              const ratificacion = getEstadoRatificacion(item.estadoRatificacion);
              const estadoSolicitud = getEstadoSolicitud(item.solicitud.estado);
              const pendiente = item.estadoRatificacion === 'PENDIENTE';

              return (
                <Table.Row key={item.id}>
                  <Table.Cell>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {item.solicitud.aspirante.nombres} {item.solicitud.aspirante.apellidos}
                      </span>
                      <span className="text-xs text-default-500">{item.solicitud.programa.nombre}</span>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex flex-col">
                      <Puntaje label="Capellanía" valor={promedioEntrevista(item, 'CAPELLANIA')} />
                      <Puntaje label="Académica" valor={promedioEntrevista(item, 'ACADEMICA')} />
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex flex-col items-start gap-1">
                      <Chip size="sm" variant="soft" color={tipo?.color ?? 'default'}>
                        {tipo?.label ?? item.tipo}
                      </Chip>
                      {item.justificacion && (
                        <span className="max-w-[200px] truncate text-xs text-default-500" title={item.justificacion}>
                          {item.justificacion}
                        </span>
                      )}
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex flex-col">
                      <span className="text-sm">
                        {item.tomadaPor.nombres} {item.tomadaPor.apellidos}
                      </span>
                      <span className="text-xs text-default-500">{formatDateTime(item.tomadaEn)}</span>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex flex-col items-start gap-1">
                      <Chip size="sm" variant="soft" color={ratificacion?.color ?? 'default'}>
                        {ratificacion?.label ?? item.estadoRatificacion}
                      </Chip>
                      {item.ratificadaPor && (
                        <span className="text-xs text-default-500">
                          {item.ratificadaPor.nombres} {item.ratificadaPor.apellidos} · {formatDateTime(item.ratificadaEn)}
                        </span>
                      )}
                      {item.comentarioRatificacion && (
                        <span
                          className="max-w-[200px] truncate text-xs text-default-500"
                          title={item.comentarioRatificacion}
                        >
                          “{item.comentarioRatificacion}”
                        </span>
                      )}
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <Chip size="sm" variant="soft" color={estadoSolicitud.color}>
                      {estadoSolicitud.label}
                    </Chip>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center gap-2">
                      <Tooltip delay={0}>
                        <Tooltip.Trigger>
                          <Button
                            isIconOnly
                            size="sm"
                            variant="outline"
                            aria-label="Ratificar"
                            isDisabled={!pendiente}
                            onPress={() => onRatificar(item)}
                          >
                            <Stamp size={16} />
                          </Button>
                        </Tooltip.Trigger>
                        <Tooltip.Content>
                          <p>{pendiente ? 'Ratificar (Vicerrectoría)' : 'Ya fue revisada'}</p>
                        </Tooltip.Content>
                      </Tooltip>
                      <Tooltip delay={0}>
                        <Tooltip.Trigger>
                          <Button
                            isIconOnly
                            size="sm"
                            variant="outline"
                            aria-label="Editar"
                            isDisabled={!pendiente}
                            onPress={() => onEdit(item)}
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
                            aria-label="Eliminar"
                            isDisabled={!pendiente}
                            onPress={() => handleDelete(item)}
                          >
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
