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
  TextArea,
  TextField,
  toast,
  type Key,
} from '@heroui/react';
import { solicitudApi } from '../../../api/solicitud';
import { useDocumento } from '../../../hooks/useDocumento';
import { getTipoDocumento, TIPOS_DOCUMENTO, type TipoDocumento } from '../../../types/Documento';
import type { SolicitudResumen } from '../../../types/Solicitud';

interface DocumentoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EMPTY_FORM = {
  solicitudId: '',
  tipo: 'DOCUMENTO_IDENTIDAD' as TipoDocumento,
  urlArchivo: '',
  observacion: '',
};

export const DocumentoModal = ({ isOpen, onClose }: DocumentoModalProps) => {
  const { selectedDocumento, createDocumento, updateDocumento } = useDocumento();
  const isEditing = !!selectedDocumento;

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [solicitudes, setSolicitudes] = useState<SolicitudResumen[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setErrors({});

    if (selectedDocumento) {
      setFormData({
        solicitudId: selectedDocumento.solicitudId,
        tipo: selectedDocumento.tipo,
        urlArchivo: selectedDocumento.urlArchivo ?? '',
        observacion: selectedDocumento.observacion ?? '',
      });
    } else {
      setFormData(EMPTY_FORM);
      solicitudApi
        .getAll({ page: 1, limit: 100 })
        .then((response) => setSolicitudes(response.data.filter((s) => s.estado !== 'ARCHIVADO')))
        .catch(() => setSolicitudes([]));
    }
  }, [isOpen, selectedDocumento]);

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
    if (!isEditing && !formData.solicitudId) nextErrors.solicitudId = 'Selecciona una solicitud';
    const url = formData.urlArchivo.trim();
    if (url && !/^https?:\/\/\S+$/i.test(url)) nextErrors.urlArchivo = 'Ingresa un enlace válido (https://...)';
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = { urlArchivo: url || null, observacion: formData.observacion.trim() || null };
      if (isEditing && selectedDocumento) {
        await updateDocumento(selectedDocumento.id, payload);
        toast.success('Documento actualizado', { description: 'Los cambios se guardaron correctamente.' });
      } else {
        await createDocumento({ solicitudId: formData.solicitudId, tipo: formData.tipo, ...payload });
        toast.success('Documento registrado', {
          description: url ? 'Quedó cargado y listo para validar.' : 'Quedó pendiente de carga.',
        });
      }
      onClose();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.danger('Error', { description: error?.response?.data?.message || 'No se pudo guardar el documento.' });
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
              <Modal.Heading>{isEditing ? 'Editar Documento' : 'Registrar Documento'}</Modal.Heading>
            </Modal.Header>

            <Modal.Body>
              <div className="space-y-4">
                {isEditing && selectedDocumento ? (
                  <div className="rounded-lg bg-default-100 p-3 text-sm">
                    <p className="text-default-500">{getTipoDocumento(selectedDocumento.tipo)}</p>
                    <p className="font-medium">
                      {selectedDocumento.solicitud.aspirante.nombres} {selectedDocumento.solicitud.aspirante.apellidos} ·{' '}
                      {selectedDocumento.solicitud.programa.nombre}
                    </p>
                  </div>
                ) : (
                  <>
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

                    <Select value={formData.tipo as Key} onChange={(key) => key && handleChange('tipo', String(key))}>
                      <Label>Tipo de documento</Label>
                      <Select.Trigger>
                        <Select.Value />
                        <Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover>
                        <ListBox>
                          {TIPOS_DOCUMENTO.map((t) => (
                            <ListBox.Item key={t.id} id={t.id} textValue={t.label}>
                              {t.label}
                              {t.obligatorio && <span className="ml-1 text-xs text-default-400">· obligatorio</span>}
                              <ListBox.ItemIndicator />
                            </ListBox.Item>
                          ))}
                        </ListBox>
                      </Select.Popover>
                    </Select>
                  </>
                )}

                <TextField isInvalid={!!errors.urlArchivo}>
                  <Label>Enlace del archivo</Label>
                  <Input
                    placeholder="https://drive.google.com/..."
                    value={formData.urlArchivo}
                    onChange={(e) => handleChange('urlArchivo', e.target.value)}
                  />
                  <FieldError>{errors.urlArchivo}</FieldError>
                </TextField>
                <p className="-mt-2 text-xs text-default-500">
                  Al agregar o cambiar el enlace, el documento queda "Por validar".
                </p>

                <TextField>
                  <Label>Observación</Label>
                  <TextArea
                    rows={3}
                    placeholder="Notas internas sobre el documento (opcional)"
                    value={formData.observacion}
                    onChange={(e) => handleChange('observacion', e.target.value)}
                  />
                </TextField>
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
