/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react';
import {
  Button,
  FieldError,
  Label,
  ListBox,
  Modal,
  Select,
  TextArea,
  TextField,
  toast,
  type Key,
} from '@heroui/react';
import { solicitudApi } from '../../../api/solicitud';
import { useDecision } from '../../../hooks/useDecision';
import { TIPOS_DECISION, type TipoDecision } from '../../../types/Decision';
import type { SolicitudResumen } from '../../../types/Solicitud';
import { useAuthStore } from '../../../stores/authStore';

interface DecisionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Estados en los que ya no tiene sentido tomar una nueva decisión
const ESTADOS_CERRADOS = ['ADMITIDO', 'RECHAZADO', 'MATRICULADO', 'CUENTA_ACTIVADA', 'ARCHIVADO', 'EN_RATIFICACION'];

const TONOS: Record<TipoDecision, string> = {
  NOTIFICAR_ADMISION: 'border-success bg-success/10',
  SOLICITAR_CORRECCION_PERFIL: 'border-warning bg-warning/10',
  RECHAZAR: 'border-danger bg-danger/10',
};

const EMPTY_FORM = {
  solicitudId: '',
  tipo: 'NOTIFICAR_ADMISION' as TipoDecision,
  justificacion: '',
};

export const DecisionModal = ({ isOpen, onClose }: DecisionModalProps) => {
  const { selectedDecision, createDecision, updateDecision } = useDecision();
  const isEditing = !!selectedDecision;

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [solicitudes, setSolicitudes] = useState<SolicitudResumen[]>([]);
  const usuario = useAuthStore((state) => state.usuario);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setErrors({});

    if (selectedDecision) {
      setFormData({
        solicitudId: selectedDecision.solicitudId,
        tipo: selectedDecision.tipo,
        justificacion: selectedDecision.justificacion ?? '',
      });
    } else {
      setFormData(EMPTY_FORM);
      solicitudApi
        .getAll({ page: 1, limit: 100 })
        .then((response) => setSolicitudes(response.data.filter((s) => !ESTADOS_CERRADOS.includes(s.estado))))
        .catch(() => setSolicitudes([]));
    }
  }, [isOpen, selectedDecision]);

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
    const nextErrors: Record<string, string> = {};
    if (!formData.solicitudId) nextErrors.solicitudId = 'Selecciona una solicitud';
    if (formData.tipo !== 'NOTIFICAR_ADMISION' && !formData.justificacion.trim()) {
      nextErrors.justificacion = 'Explica el motivo de la decisión';
    }
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        tipo: formData.tipo,
        justificacion: formData.justificacion.trim() || null,
      };
      if (isEditing && selectedDecision) {
        await updateDecision(selectedDecision.id, payload);
        toast.success('Decisión actualizada', { description: 'Los cambios se guardaron correctamente.' });
      } else {
        await createDecision({ solicitudId: formData.solicitudId, ...payload });
        toast.success('Decisión registrada', {
          description:
            formData.tipo === 'SOLICITAR_CORRECCION_PERFIL'
              ? 'La solicitud pasó a corrección de perfil.'
              : 'La solicitud quedó en ratificación de Vicerrectoría.',
        });
      }
      onClose();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.danger('Error', { description: error?.response?.data?.message || 'No se pudo guardar la decisión.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal>
      <Modal.Backdrop isOpen={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
        <Modal.Container placement="center" size="md" scroll="inside">
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>{isEditing ? 'Editar Decisión' : 'Registrar Decisión de Admisión'}</Modal.Heading>
            </Modal.Header>

            <Modal.Body>
              <div className="space-y-4">
                {isEditing && selectedDecision ? (
                  <div className="rounded-lg bg-default-100 p-3 text-sm">
                    <p className="text-default-500">Solicitud</p>
                    <p className="font-medium">
                      {selectedDecision.solicitud.aspirante.nombres} {selectedDecision.solicitud.aspirante.apellidos} ·{' '}
                      {selectedDecision.solicitud.programa.nombre}
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

                <div>
                  <p className="mb-2 text-sm font-medium">Decisión</p>
                  <div className="grid gap-2">
                    {TIPOS_DECISION.map((t) => {
                      const activa = formData.tipo === t.id;
                      return (
                        <button
                          key={t.id}
                          type="button"
                          aria-pressed={activa}
                          onClick={() => handleChange('tipo', t.id)}
                          className={`rounded-xl border-2 p-3 text-left transition ${
                            activa ? TONOS[t.id] : 'border-default-200 hover:border-default-300'
                          }`}
                        >
                          <p className="text-sm font-semibold">{t.label}</p>
                          <p className="text-xs text-default-500">{t.descripcion}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {!isEditing && usuario && (
                  <p className="text-xs text-default-500">
                    La decisión quedará registrada a nombre de{' '}
                    <strong>
                      {usuario.nombres} {usuario.apellidos}
                    </strong>
                    .
                  </p>
                )}

                <TextField isInvalid={!!errors.justificacion}>
                  <Label>Justificación</Label>
                  <TextArea
                    rows={3}
                    placeholder="Fundamenta la decisión con base en las entrevistas y requisitos"
                    value={formData.justificacion}
                    onChange={(e) => handleChange('justificacion', e.target.value)}
                  />
                  <FieldError>{errors.justificacion}</FieldError>
                </TextField>
              </div>
            </Modal.Body>

            <Modal.Footer>
              <Button variant="danger-soft" onPress={onClose} isDisabled={isSubmitting}>
                Cancelar
              </Button>
              <Button variant="primary" onPress={handleSubmit} isPending={isSubmitting}>
                {isEditing ? 'Guardar Cambios' : 'Registrar Decisión'}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};
