/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react';
import {
  Button,
  FieldError,
  Input,
  Label,
  ListBox,
  Modal,
  Select,
  TextField,
  toast,
  type Key,
} from '@heroui/react';
import { solicitudApi } from '../../../api/solicitud';
import { usuarioApi } from '../../../api/usuario';
import { useEntrevista } from '../../../hooks/useEntrevista';
import {
  createEntrevistaSchema,
  ESTADOS_ENTREVISTA,
  MODALIDADES,
  TIPOS_ENTREVISTA,
  type EstadoEntrevista,
  type TipoEntrevista,
} from '../../../types/Entrevista';
import type { SolicitudResumen } from '../../../types/Solicitud';
import type { Usuario } from '../../../types/Usuario';
import { toDateTimeLocal } from '../../../utils/format';

// Roles sugeridos como evaluadores según el tipo de entrevista
const ROLES_EVALUADOR: Record<TipoEntrevista, string[]> = {
  CAPELLANIA: ['CAPELLAN', 'ADMIN'],
  ACADEMICA: ['COORDINADOR_PROGRAMA', 'VICERRECTORIA', 'ADMIN'],
};

interface EntrevistaModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Preselecciona la solicitud (cuando se programa desde el detalle de una solicitud) */
  defaultSolicitudId?: string | null;
  onSaved?: () => void;
}

const EMPTY_FORM = {
  solicitudId: '',
  tipo: 'CAPELLANIA' as TipoEntrevista,
  evaluadorId: '',
  fechaProgramada: '',
  modalidad: 'Presencial',
  lugarOEnlace: '',
  estado: 'PENDIENTE' as EstadoEntrevista,
  motivoReprogramacion: '',
};

export const EntrevistaModal = ({ isOpen, onClose, defaultSolicitudId, onSaved }: EntrevistaModalProps) => {
  const { selectedEntrevista, createEntrevista, updateEntrevista } = useEntrevista();
  const isEditing = !!selectedEntrevista;

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [solicitudes, setSolicitudes] = useState<SolicitudResumen[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setErrors({});

    usuarioApi
      .getAll()
      .then((response) => setUsuarios((response.data || []).filter((u) => u.activo)))
      .catch(() => setUsuarios([]));

    if (!selectedEntrevista) {
      solicitudApi
        .getAll({ page: 1, limit: 100 })
        .then((response) => setSolicitudes(response.data))
        .catch(() => setSolicitudes([]));
    }

    if (selectedEntrevista) {
      setFormData({
        solicitudId: selectedEntrevista.solicitudId,
        tipo: selectedEntrevista.tipo,
        evaluadorId: selectedEntrevista.evaluadorId ?? '',
        fechaProgramada: toDateTimeLocal(selectedEntrevista.fechaProgramada),
        modalidad: selectedEntrevista.modalidad ?? 'Presencial',
        lugarOEnlace: selectedEntrevista.lugarOEnlace ?? '',
        estado: selectedEntrevista.estado,
        motivoReprogramacion: selectedEntrevista.motivoReprogramacion ?? '',
      });
    } else {
      setFormData({ ...EMPTY_FORM, solicitudId: defaultSolicitudId ?? '' });
    }
  }, [isOpen, selectedEntrevista, defaultSolicitudId]);

  const handleChange = (field: keyof typeof EMPTY_FORM, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = async () => {
    const payload = {
      solicitudId: formData.solicitudId,
      tipo: formData.tipo,
      evaluadorId: formData.evaluadorId || null,
      fechaProgramada: formData.fechaProgramada ? new Date(formData.fechaProgramada).toISOString() : '',
      modalidad: formData.modalidad || null,
      lugarOEnlace: formData.lugarOEnlace.trim() || null,
    };

    const validation = createEntrevistaSchema.safeParse(payload);
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }
    if (isEditing && formData.estado === 'REPROGRAMADA' && !formData.motivoReprogramacion.trim()) {
      setErrors({ motivoReprogramacion: 'Indica el motivo de la reprogramación' });
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditing && selectedEntrevista) {
        await updateEntrevista(selectedEntrevista.id, {
          ...payload,
          estado: formData.estado,
          motivoReprogramacion: formData.motivoReprogramacion.trim() || null,
        });
        toast.success('Entrevista actualizada', { description: 'Los cambios se guardaron correctamente.' });
      } else {
        await createEntrevista(payload);
        toast.success('Entrevista programada', { description: 'La entrevista quedó agendada.' });
      }
      onSaved?.();
      onClose();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.danger('Error', { description: error?.response?.data?.message || 'Ocurrió un error al guardar.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const evaluadores = usuarios.filter(
    (u) => ROLES_EVALUADOR[formData.tipo].includes(u.rol) || u.id === formData.evaluadorId,
  );
  const solicitudFija = isEditing || !!defaultSolicitudId;
  const solicitudActual = isEditing ? selectedEntrevista?.solicitud : solicitudes.find((s) => s.id === formData.solicitudId);

  return (
    <Modal>
      <Modal.Backdrop isOpen={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
        <Modal.Container placement="center" size="md" scroll="inside">
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>{isEditing ? 'Editar Entrevista' : 'Programar Entrevista'}</Modal.Heading>
            </Modal.Header>

            <Modal.Body>
              <div className="space-y-4">
                {solicitudFija && solicitudActual ? (
                  <div className="rounded-lg bg-default-100 p-3 text-sm">
                    <p className="text-default-500">Solicitud</p>
                    <p className="font-medium">
                      {solicitudActual.aspirante.nombres} {solicitudActual.aspirante.apellidos} ·{' '}
                      {solicitudActual.programa.nombre}
                    </p>
                  </div>
                ) : (
                  <Select
                    placeholder="Selecciona una solicitud"
                    value={(formData.solicitudId || null) as Key | null}
                    onChange={(key) => handleChange('solicitudId', key ? String(key) : '')}
                    isInvalid={!!errors.solicitudId}
                  >
                    <Label>Solicitud (aspirante · programa)</Label>
                    <Select.Trigger>
                      <Select.Value />
                      <Select.Indicator />
                    </Select.Trigger>
                    <Select.Popover>
                      <ListBox>
                        {solicitudes.map((s) => (
                          <ListBox.Item
                            key={s.id}
                            id={s.id}
                            textValue={`${s.aspirante.nombres} ${s.aspirante.apellidos} ${s.programa.nombre}`}
                          >
                            {s.aspirante.nombres} {s.aspirante.apellidos} · {s.programa.nombre}
                            <ListBox.ItemIndicator />
                          </ListBox.Item>
                        ))}
                      </ListBox>
                    </Select.Popover>
                    <FieldError>{errors.solicitudId}</FieldError>
                  </Select>
                )}

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Select
                    value={formData.tipo as Key}
                    onChange={(key) => key && handleChange('tipo', String(key))}
                  >
                    <Label>Tipo</Label>
                    <Select.Trigger>
                      <Select.Value />
                      <Select.Indicator />
                    </Select.Trigger>
                    <Select.Popover>
                      <ListBox>
                        {TIPOS_ENTREVISTA.map((t) => (
                          <ListBox.Item key={t.id} id={t.id} textValue={t.label}>
                            {t.label}
                            <ListBox.ItemIndicator />
                          </ListBox.Item>
                        ))}
                      </ListBox>
                    </Select.Popover>
                  </Select>

                  <Select
                    placeholder="Sin asignar"
                    value={(formData.evaluadorId || null) as Key | null}
                    onChange={(key) => handleChange('evaluadorId', key ? String(key) : '')}
                  >
                    <Label>Evaluador</Label>
                    <Select.Trigger>
                      <Select.Value />
                      <Select.Indicator />
                    </Select.Trigger>
                    <Select.Popover>
                      <ListBox>
                        {evaluadores.map((u) => (
                          <ListBox.Item key={u.id} id={u.id} textValue={`${u.nombres} ${u.apellidos}`}>
                            {u.nombres} {u.apellidos} · {u.rol.replace(/_/g, ' ').toLowerCase()}
                            <ListBox.ItemIndicator />
                          </ListBox.Item>
                        ))}
                      </ListBox>
                    </Select.Popover>
                  </Select>
                </div>

                <TextField isInvalid={!!errors.fechaProgramada}>
                  <Label>Fecha y hora</Label>
                  <Input
                    type="datetime-local"
                    value={formData.fechaProgramada}
                    onChange={(e) => handleChange('fechaProgramada', e.target.value)}
                  />
                  <FieldError>{errors.fechaProgramada}</FieldError>
                </TextField>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Select
                    value={formData.modalidad as Key}
                    onChange={(key) => key && handleChange('modalidad', String(key))}
                  >
                    <Label>Modalidad</Label>
                    <Select.Trigger>
                      <Select.Value />
                      <Select.Indicator />
                    </Select.Trigger>
                    <Select.Popover>
                      <ListBox>
                        {MODALIDADES.map((m) => (
                          <ListBox.Item key={m} id={m} textValue={m}>
                            {m}
                            <ListBox.ItemIndicator />
                          </ListBox.Item>
                        ))}
                      </ListBox>
                    </Select.Popover>
                  </Select>

                  <TextField>
                    <Label>{formData.modalidad === 'Virtual' ? 'Enlace' : 'Lugar'}</Label>
                    <Input
                      placeholder={formData.modalidad === 'Virtual' ? 'https://meet...' : 'Ej. Capilla, Bloque 2'}
                      value={formData.lugarOEnlace}
                      onChange={(e) => handleChange('lugarOEnlace', e.target.value)}
                    />
                  </TextField>
                </div>

                {isEditing && (
                  <>
                    <Select
                      value={formData.estado as Key}
                      onChange={(key) => key && handleChange('estado', String(key))}
                    >
                      <Label>Estado</Label>
                      <Select.Trigger>
                        <Select.Value />
                        <Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover>
                        <ListBox>
                          {ESTADOS_ENTREVISTA.map((e) => (
                            <ListBox.Item key={e.id} id={e.id} textValue={e.label}>
                              {e.label}
                              <ListBox.ItemIndicator />
                            </ListBox.Item>
                          ))}
                        </ListBox>
                      </Select.Popover>
                    </Select>

                    {formData.estado === 'REPROGRAMADA' && (
                      <TextField isInvalid={!!errors.motivoReprogramacion}>
                        <Label>Motivo de reprogramación</Label>
                        <Input
                          value={formData.motivoReprogramacion}
                          onChange={(e) => handleChange('motivoReprogramacion', e.target.value)}
                        />
                        <FieldError>{errors.motivoReprogramacion}</FieldError>
                      </TextField>
                    )}
                  </>
                )}
              </div>
            </Modal.Body>

            <Modal.Footer>
              <Button variant="danger-soft" onPress={onClose} isDisabled={isSubmitting}>
                Cancelar
              </Button>
              <Button variant="primary" onPress={handleSubmit} isPending={isSubmitting}>
                {isEditing ? 'Guardar Cambios' : 'Programar'}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};
