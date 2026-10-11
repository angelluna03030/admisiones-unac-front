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
  Switch,
  TextArea,
  TextField,
  toast,
  type Key,
} from '@heroui/react';
import { solicitudApi } from '../../../api/solicitud';
import { useObservacion } from '../../../hooks/useObservacion';
import { MOTIVOS_FRECUENTES } from '../../../types/Observacion';
import type { SolicitudResumen } from '../../../types/Solicitud';

interface ObservacionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ESTADOS_CERRADOS = ['ADMITIDO', 'RECHAZADO', 'MATRICULADO', 'CUENTA_ACTIVADA', 'ARCHIVADO'];

const EMPTY_FORM = { solicitudId: '', motivo: '', detalle: '', notificarWhatsapp: true };

export const ObservacionModal = ({ isOpen, onClose }: ObservacionModalProps) => {
  const { selectedObservacion, createObservacion, updateObservacion } = useObservacion();
  const isEditing = !!selectedObservacion;

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [solicitudes, setSolicitudes] = useState<SolicitudResumen[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setErrors({});

    if (selectedObservacion) {
      setFormData({
        solicitudId: selectedObservacion.solicitudId,
        motivo: selectedObservacion.motivo,
        detalle: selectedObservacion.detalle ?? '',
        notificarWhatsapp: false,
      });
    } else {
      setFormData(EMPTY_FORM);
      solicitudApi
        .getAll({ page: 1, limit: 100 })
        .then((response) => setSolicitudes(response.data.filter((s) => !ESTADOS_CERRADOS.includes(s.estado))))
        .catch(() => setSolicitudes([]));
    }
  }, [isOpen, selectedObservacion]);

  const setCampo = <K extends keyof typeof EMPTY_FORM>(field: K, value: (typeof EMPTY_FORM)[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = async () => {
    const nextErrors: Record<string, string> = {};
    if (!isEditing && !formData.solicitudId) nextErrors.solicitudId = 'Selecciona una solicitud';
    if (formData.motivo.trim().length < 3) nextErrors.motivo = 'Indica el motivo de la observación';
    if (Object.values(nextErrors).some(Boolean)) {
      setErrors(nextErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const datos = { motivo: formData.motivo.trim(), detalle: formData.detalle.trim() || null };
      if (isEditing && selectedObservacion) {
        await updateObservacion(selectedObservacion.id, datos);
        toast.success('Observación actualizada', { description: 'Los cambios se guardaron correctamente.' });
      } else {
        const whatsapp = await createObservacion({
          solicitudId: formData.solicitudId,
          notificarWhatsapp: formData.notificarWhatsapp,
          ...datos,
        });
        toast.success('Observación registrada', { description: 'La solicitud quedó en estado Observado.' });
        if (whatsapp === 'ENVIADO') toast.success('WhatsApp enviado', { description: 'El aspirante fue notificado.' });
        if (whatsapp === 'SIN_TELEFONO')
          toast.warning('Sin WhatsApp', { description: 'El aspirante no tiene teléfono registrado.' });
        if (whatsapp === 'ERROR')
          toast.danger('WhatsApp no enviado', { description: 'Revisa que la instancia de Evolution esté conectada.' });
      }
      onClose();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.danger('Error', { description: error?.response?.data?.message || 'No se pudo guardar la observación.' });
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
              <Modal.Heading>{isEditing ? 'Editar Observación' : 'Registrar Observación'}</Modal.Heading>
            </Modal.Header>

            <Modal.Body>
              <div className="space-y-4">
                {isEditing && selectedObservacion ? (
                  <div className="rounded-lg bg-default-100 p-3 text-sm">
                    <p className="text-default-500">Solicitud</p>
                    <p className="font-medium">
                      {selectedObservacion.solicitud.aspirante.nombres} {selectedObservacion.solicitud.aspirante.apellidos} ·{' '}
                      {selectedObservacion.solicitud.programa.nombre}
                    </p>
                  </div>
                ) : (
                  <Select
                    placeholder="Selecciona una solicitud"
                    value={(formData.solicitudId || null) as Key | null}
                    onChange={(key) => setCampo('solicitudId', key ? String(key) : '')}
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

                <TextField isInvalid={!!errors.motivo}>
                  <Label>Motivo</Label>
                  <Input
                    placeholder="Ej. Falta el certificado de bachiller"
                    value={formData.motivo}
                    maxLength={150}
                    onChange={(e) => setCampo('motivo', e.target.value)}
                  />
                  <FieldError>{errors.motivo}</FieldError>
                </TextField>
                <div className="-mt-2 flex flex-wrap gap-1.5">
                  {MOTIVOS_FRECUENTES.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setCampo('motivo', m)}
                      className={`rounded-full border px-2.5 py-1 text-xs transition ${
                        formData.motivo === m
                          ? 'border-primary-400 bg-primary-50 text-primary-600'
                          : 'border-default-200 text-default-600 hover:bg-default-100'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>

                <TextField>
                  <Label>Detalle para el aspirante</Label>
                  <TextArea
                    rows={3}
                    placeholder="Explica qué debe corregir o entregar y cómo hacerlo"
                    value={formData.detalle}
                    onChange={(e) => setCampo('detalle', e.target.value)}
                  />
                </TextField>

                {!isEditing && (
                  <Switch
                    isSelected={formData.notificarWhatsapp}
                    onChange={(value) => setCampo('notificarWhatsapp', value)}
                  >
                    <Switch.Control className="data-[selected]:bg-success">
                      <Switch.Thumb />
                    </Switch.Control>
                    <Switch.Content>
                      <Label>Notificar al aspirante por WhatsApp</Label>
                    </Switch.Content>
                  </Switch>
                )}
              </div>
            </Modal.Body>

            <Modal.Footer>
              <Button variant="danger-soft" onPress={onClose} isDisabled={isSubmitting}>
                Cancelar
              </Button>
              <Button variant="primary" onPress={handleSubmit} isPending={isSubmitting}>
                {isEditing ? 'Guardar Cambios' : 'Registrar'}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};
