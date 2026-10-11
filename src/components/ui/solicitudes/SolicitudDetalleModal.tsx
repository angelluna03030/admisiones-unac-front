/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react';
import {
  Button,
  Chip,
  Label,
  ListBox,
  Modal,
  Select,
  Spinner,
  toast,
  type Key,
} from '@heroui/react';
import { CalendarPlus, CheckCircle2, Circle, FileText, MessageSquareWarning, Scale } from 'lucide-react';
import { useSolicitud } from '../../../hooks/useSolicitud';
import { ESTADOS_SOLICITUD, type EstadoSolicitud } from '../../../types/Solicitud';
import { ESTADOS_ENTREVISTA, TIPOS_ENTREVISTA } from '../../../types/Entrevista';
import { formatCurrency, formatDate, formatDateTime } from '../../../utils/format';
import { EstadoSolicitudChip } from './EstadoSolicitudChip';

interface SolicitudDetalleModalProps {
  solicitudId: string | null;
  onClose: () => void;
  onProgramarEntrevista: (solicitudId: string) => void;
}

const Dato = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div>
    <p className="text-xs text-default-500">{label}</p>
    <p className="text-sm font-medium text-foreground">{value}</p>
  </div>
);

export const SolicitudDetalleModal = ({
  solicitudId,
  onClose,
  onProgramarEntrevista,
}: SolicitudDetalleModalProps) => {
  const { detalle, isLoadingDetalle, fetchDetalle, clearDetalle, cambiarEstado } = useSolicitud();
  const [nuevoEstado, setNuevoEstado] = useState<EstadoSolicitud | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (solicitudId) {
      fetchDetalle(solicitudId);
    } else {
      clearDetalle();
    }
  }, [solicitudId, fetchDetalle, clearDetalle]);

  useEffect(() => {
    setNuevoEstado(detalle?.estado ?? null);
  }, [detalle?.estado]);

  const handleCambiarEstado = async () => {
    if (!detalle || !nuevoEstado || nuevoEstado === detalle.estado) return;
    setIsSaving(true);
    try {
      await cambiarEstado(detalle.id, nuevoEstado);
      toast.success('Estado actualizado', {
        description: `La solicitud pasó a "${ESTADOS_SOLICITUD.find((e) => e.id === nuevoEstado)?.label}".`,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.danger('Error', { description: error?.response?.data?.message || 'No se pudo cambiar el estado.' });
    } finally {
      setIsSaving(false);
    }
  };

  const hitos = detalle
    ? [
        { label: 'Formulario completado', fecha: detalle.formularioCompletadoEn ?? detalle.createdAt },
        { label: 'Pago de inscripción', fecha: detalle.pagoInscripcionEn },
        { label: 'Validación de requisitos', fecha: detalle.fechaValidacion },
        { label: 'Admitido preliminar', fecha: detalle.aprobadoPreliminarEn },
        { label: 'Matrícula pagada', fecha: detalle.matriculaPagadaEn },
        { label: 'Cuenta activada', fecha: detalle.cuentaActivadaEn },
      ]
    : [];

  return (
    <Modal>
      <Modal.Backdrop isOpen={!!solicitudId} onOpenChange={(open) => { if (!open) onClose(); }}>
        <Modal.Container placement="center" size="lg" scroll="inside">
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>Detalle de la Solicitud</Modal.Heading>
            </Modal.Header>

            <Modal.Body>
              {isLoadingDetalle || !detalle ? (
                <div className="flex h-48 items-center justify-center">
                  <Spinner size="lg" />
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Encabezado */}
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-lg font-semibold">
                        {detalle.aspirante.nombres} {detalle.aspirante.apellidos}
                      </p>
                      <p className="text-sm text-default-500">
                        {detalle.aspirante.tipoDocumento} {detalle.aspirante.numeroDocumento} ·{' '}
                        {detalle.aspirante.correo}
                      </p>
                      <p className="mt-1 font-mono text-xs text-default-400">{detalle.codigo}</p>
                    </div>
                    <EstadoSolicitudChip estado={detalle.estado} />
                  </div>

                  {/* Cambio de estado */}
                  <div className="flex flex-col gap-3 rounded-lg border border-default-200 p-3 sm:flex-row sm:items-end">
                    <Select
                      className="flex-1"
                      value={nuevoEstado as Key | null}
                      onChange={(key) => setNuevoEstado(key ? (String(key) as EstadoSolicitud) : null)}
                    >
                      <Label>Mover a la etapa</Label>
                      <Select.Trigger>
                        <Select.Value />
                        <Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover>
                        <ListBox>
                          {ESTADOS_SOLICITUD.map((e) => (
                            <ListBox.Item key={e.id} id={e.id} textValue={e.label}>
                              {e.label}
                              <ListBox.ItemIndicator />
                            </ListBox.Item>
                          ))}
                        </ListBox>
                      </Select.Popover>
                    </Select>
                    <Button
                      variant="primary"
                      isPending={isSaving}
                      isDisabled={!nuevoEstado || nuevoEstado === detalle.estado}
                      onPress={handleCambiarEstado}
                    >
                      Aplicar
                    </Button>
                  </div>

                  {/* Datos principales */}
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                    <Dato label="Programa" value={detalle.programa.nombre} />
                    <Dato label="Facultad / Jornada" value={`${detalle.programa.facultad ?? '—'} / ${detalle.programa.jornada ?? '—'}`} />
                    <Dato label="Puntaje ICFES" value={detalle.puntajeIcfes ?? '—'} />
                    <Dato label="Valor inscripción" value={detalle.valorPagoInscripcion ? formatCurrency(detalle.valorPagoInscripcion) : '—'} />
                    <Dato label="Valor matrícula" value={detalle.valorMatricula ? formatCurrency(detalle.valorMatricula) : '—'} />
                    <Dato label="Fecha límite respuesta" value={formatDate(detalle.fechaLimiteRespuesta)} />
                    <Dato label="Código estudiante" value={detalle.codigoEstudiante ?? '—'} />
                    <Dato label="Ciudad" value={detalle.aspirante.ciudad ?? '—'} />
                    <Dato label="Teléfono" value={detalle.aspirante.telefono ?? '—'} />
                  </div>

                  {/* Línea de tiempo */}
                  <div>
                    <h4 className="mb-2 text-sm font-semibold text-default-600">Hitos del proceso</h4>
                    <ol className="space-y-2">
                      {hitos.map((h) => (
                        <li key={h.label} className="flex items-center gap-2 text-sm">
                          {h.fecha ? (
                            <CheckCircle2 size={16} className="text-success" />
                          ) : (
                            <Circle size={16} className="text-default-300" />
                          )}
                          <span className={h.fecha ? 'text-foreground' : 'text-default-400'}>{h.label}</span>
                          <span className="ml-auto text-xs text-default-500">{formatDateTime(h.fecha)}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Entrevistas */}
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-default-600">
                        Entrevistas ({detalle.entrevistas.length})
                      </h4>
                      <Button size="sm" variant="outline" onPress={() => onProgramarEntrevista(detalle.id)}>
                        <CalendarPlus size={16} /> Programar
                      </Button>
                    </div>
                    {detalle.entrevistas.length === 0 ? (
                      <p className="text-sm text-default-400">Aún no se han programado entrevistas.</p>
                    ) : (
                      <ul className="space-y-2">
                        {detalle.entrevistas.map((e) => {
                          const estado = ESTADOS_ENTREVISTA.find((x) => x.id === e.estado);
                          const promedio = e.evaluacionCapellania?.promedio ?? e.evaluacionAcademica?.promedio;
                          return (
                            <li key={e.id} className="flex flex-wrap items-center gap-2 rounded-lg bg-default-100 p-2 text-sm">
                              <span className="font-medium">
                                {TIPOS_ENTREVISTA.find((t) => t.id === e.tipo)?.label}
                              </span>
                              <span className="text-default-500">{formatDateTime(e.fechaProgramada)}</span>
                              <span className="text-default-500">
                                {e.evaluador ? `· ${e.evaluador.nombres} ${e.evaluador.apellidos}` : '· Sin evaluador'}
                              </span>
                              <span className="ml-auto flex items-center gap-2">
                                {promedio && (
                                  <Chip size="sm" variant="soft" color="success">
                                    {Number(promedio).toFixed(1)} / 5
                                  </Chip>
                                )}
                                <Chip size="sm" variant="soft" color={estado?.color ?? 'default'}>
                                  {estado?.label ?? e.estado}
                                </Chip>
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>

                  {/* Documentos */}
                  <div>
                    <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-default-600">
                      <FileText size={16} /> Documentos ({detalle.documentos.length})
                    </h4>
                    {detalle.documentos.length === 0 ? (
                      <p className="text-sm text-default-400">No hay documentos cargados.</p>
                    ) : (
                      <ul className="flex flex-wrap gap-2">
                        {detalle.documentos.map((d) => (
                          <li key={d.id}>
                            <Chip
                              size="sm"
                              variant="soft"
                              color={
                                d.estado === 'VALIDADO'
                                  ? 'success'
                                  : d.estado === 'RECHAZADO'
                                    ? 'danger'
                                    : d.estado === 'CARGADO'
                                      ? 'warning'
                                      : 'default'
                              }
                            >
                              {d.tipo.replace(/_/g, ' ')} · {d.estado.toLowerCase()}
                            </Chip>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Decisiones y observaciones */}
                  {(detalle.decisiones.length > 0 || detalle.observaciones.length > 0) && (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-default-600">
                          <Scale size={16} /> Decisiones
                        </h4>
                        {detalle.decisiones.map((d) => (
                          <div key={d.id} className="mb-2 rounded-lg bg-default-100 p-2 text-sm">
                            <p className="font-medium">{d.tipo.replace(/_/g, ' ')}</p>
                            <p className="text-xs text-default-500">
                              {d.tomadaPor.nombres} {d.tomadaPor.apellidos} · {formatDate(d.tomadaEn)} · Ratificación:{' '}
                              {d.estadoRatificacion.toLowerCase()}
                            </p>
                          </div>
                        ))}
                      </div>
                      <div>
                        <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-default-600">
                          <MessageSquareWarning size={16} /> Observaciones
                        </h4>
                        {detalle.observaciones.map((o) => (
                          <div key={o.id} className="mb-2 rounded-lg bg-default-100 p-2 text-sm">
                            <p className="font-medium">{o.motivo}</p>
                            {o.detalle && <p className="text-default-600">{o.detalle}</p>}
                            <p className="text-xs text-default-500">
                              {o.emitidaPor.nombres} {o.emitidaPor.apellidos} · {formatDate(o.createdAt)} ·{' '}
                              {o.resuelta ? 'Resuelta' : 'Pendiente'}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Modal.Body>

            <Modal.Footer>
              <Button variant="outline" onPress={onClose}>
                Cerrar
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};
