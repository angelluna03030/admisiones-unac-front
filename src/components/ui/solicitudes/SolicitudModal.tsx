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
  TextField,
  toast,
  type Key,
} from '@heroui/react';
import { aspiranteApi } from '../../../api/aspirante';
import { solicitudApi } from '../../../api/solicitud';
import { useSolicitud } from '../../../hooks/useSolicitud';
import { usePrograma } from '../../../hooks/usePrograma';
import type { Aspirante } from '../../../types/Aspirante';

interface SolicitudModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EMPTY_FORM = {
  aspiranteId: '',
  programaId: '',
  puntajeIcfes: '',
  valorPagoInscripcion: '',
  valorMatricula: '',
  fechaLimiteRespuesta: '',
  codigoEstudiante: '',
  bachillerValidado: false,
  icfesValidado: false,
  requisitosValidados: false,
};

const toNumberOrNull = (value: string) => (value.trim() === '' ? null : Number(value));

export const SolicitudModal = ({ isOpen, onClose }: SolicitudModalProps) => {
  const { selectedSolicitud, createSolicitud, updateSolicitud } = useSolicitud();
  const { programas, fetchProgramas } = usePrograma();
  const isEditing = !!selectedSolicitud;

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [aspirantes, setAspirantes] = useState<Aspirante[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setErrors({});
    fetchProgramas({ page: 1, limit: 100 });

    if (!selectedSolicitud) {
      setFormData(EMPTY_FORM);
      aspiranteApi
        .getAll({ page: 1, limit: 100 })
        .then((response) => setAspirantes(response.data))
        .catch(() => setAspirantes([]));
      return;
    }

    // En edición se cargan los valores completos (el listado no trae montos ni fechas)
    solicitudApi.getById(selectedSolicitud.id).then((detalle) => {
      setFormData({
        aspiranteId: detalle.aspirante.id,
        programaId: detalle.programa.id,
        puntajeIcfes: detalle.puntajeIcfes?.toString() ?? '',
        valorPagoInscripcion: detalle.valorPagoInscripcion ? String(Number(detalle.valorPagoInscripcion)) : '',
        valorMatricula: detalle.valorMatricula ? String(Number(detalle.valorMatricula)) : '',
        fechaLimiteRespuesta: detalle.fechaLimiteRespuesta?.split('T')[0] ?? '',
        codigoEstudiante: detalle.codigoEstudiante ?? '',
        bachillerValidado: detalle.bachillerValidado,
        icfesValidado: detalle.icfesValidado,
        requisitosValidados: detalle.requisitosValidados,
      });
    });
  }, [isOpen, selectedSolicitud, fetchProgramas]);

  const handleChange = (field: keyof typeof EMPTY_FORM, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!isEditing && !formData.aspiranteId) next.aspiranteId = 'Selecciona un aspirante';
    if (!formData.programaId) next.programaId = 'Selecciona un programa';
    const icfes = toNumberOrNull(formData.puntajeIcfes);
    if (icfes !== null && (!Number.isInteger(icfes) || icfes < 0 || icfes > 500)) {
      next.puntajeIcfes = 'Debe ser un número entero entre 0 y 500';
    }
    for (const field of ['valorPagoInscripcion', 'valorMatricula'] as const) {
      const valor = toNumberOrNull(formData[field]);
      if (valor !== null && (Number.isNaN(valor) || valor < 0)) next[field] = 'Valor inválido';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      if (isEditing && selectedSolicitud) {
        await updateSolicitud(selectedSolicitud.id, {
          programaId: formData.programaId,
          puntajeIcfes: toNumberOrNull(formData.puntajeIcfes),
          valorPagoInscripcion: toNumberOrNull(formData.valorPagoInscripcion),
          valorMatricula: toNumberOrNull(formData.valorMatricula),
          fechaLimiteRespuesta: formData.fechaLimiteRespuesta || null,
          codigoEstudiante: formData.codigoEstudiante.trim() || null,
          bachillerValidado: formData.bachillerValidado,
          icfesValidado: formData.icfesValidado,
          requisitosValidados: formData.requisitosValidados,
        });
        toast.success('Solicitud actualizada', { description: 'Los cambios se guardaron correctamente.' });
      } else {
        await createSolicitud({
          aspiranteId: formData.aspiranteId,
          programaId: formData.programaId,
          puntajeIcfes: toNumberOrNull(formData.puntajeIcfes),
          valorPagoInscripcion: toNumberOrNull(formData.valorPagoInscripcion),
        });
        toast.success('Solicitud creada', { description: 'La solicitud inició el proceso de admisión.' });
      }
      onClose();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.danger('Error', {
        description: error?.response?.data?.message || 'Ocurrió un error al guardar.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const programasActivos = programas.filter((p) => p.activo || p.id === formData.programaId);

  return (
    <Modal>
      <Modal.Backdrop isOpen={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
        <Modal.Container placement="center" size="lg" scroll="inside">
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>{isEditing ? 'Editar Solicitud' : 'Nueva Solicitud'}</Modal.Heading>
            </Modal.Header>

            <Modal.Body>
              <div className="space-y-4">
                {isEditing && selectedSolicitud ? (
                  <div className="rounded-lg bg-default-100 p-3 text-sm">
                    <p className="text-default-500">Aspirante</p>
                    <p className="font-medium">
                      {selectedSolicitud.aspirante.nombres} {selectedSolicitud.aspirante.apellidos} ·{' '}
                      {selectedSolicitud.aspirante.numeroDocumento}
                    </p>
                  </div>
                ) : (
                  <Select
                    placeholder="Selecciona un aspirante"
                    value={(formData.aspiranteId || null) as Key | null}
                    onChange={(key) => handleChange('aspiranteId', key ? String(key) : '')}
                    isInvalid={!!errors.aspiranteId}
                  >
                    <Label>Aspirante</Label>
                    <Select.Trigger>
                      <Select.Value />
                      <Select.Indicator />
                    </Select.Trigger>
                    <Select.Popover>
                      <ListBox>
                        {aspirantes.map((a) => (
                          <ListBox.Item
                            key={a.id}
                            id={a.id}
                            textValue={`${a.nombres} ${a.apellidos} ${a.numeroDocumento}`}
                          >
                            {a.nombres} {a.apellidos} · {a.numeroDocumento}
                            <ListBox.ItemIndicator />
                          </ListBox.Item>
                        ))}
                      </ListBox>
                    </Select.Popover>
                    <FieldError>{errors.aspiranteId}</FieldError>
                  </Select>
                )}

                <Select
                  placeholder="Selecciona un programa"
                  value={(formData.programaId || null) as Key | null}
                  onChange={(key) => handleChange('programaId', key ? String(key) : '')}
                  isInvalid={!!errors.programaId}
                >
                  <Label>Programa académico</Label>
                  <Select.Trigger>
                    <Select.Value />
                    <Select.Indicator />
                  </Select.Trigger>
                  <Select.Popover>
                    <ListBox>
                      {programasActivos.map((p) => (
                        <ListBox.Item key={p.id} id={p.id} textValue={p.nombre}>
                          {p.nombre}
                          <ListBox.ItemIndicator />
                        </ListBox.Item>
                      ))}
                    </ListBox>
                  </Select.Popover>
                  <FieldError>{errors.programaId}</FieldError>
                </Select>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <TextField isInvalid={!!errors.puntajeIcfes}>
                    <Label>Puntaje ICFES</Label>
                    <Input
                      type="number"
                      placeholder="Ej. 320"
                      value={formData.puntajeIcfes}
                      onChange={(e) => handleChange('puntajeIcfes', e.target.value)}
                    />
                    <FieldError>{errors.puntajeIcfes}</FieldError>
                  </TextField>

                  <TextField isInvalid={!!errors.valorPagoInscripcion}>
                    <Label>Valor inscripción (COP)</Label>
                    <Input
                      type="number"
                      placeholder="Ej. 150000"
                      value={formData.valorPagoInscripcion}
                      onChange={(e) => handleChange('valorPagoInscripcion', e.target.value)}
                    />
                    <FieldError>{errors.valorPagoInscripcion}</FieldError>
                  </TextField>
                </div>

                {isEditing && (
                  <>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <TextField isInvalid={!!errors.valorMatricula}>
                        <Label>Valor matrícula (COP)</Label>
                        <Input
                          type="number"
                          placeholder="Ej. 2500000"
                          value={formData.valorMatricula}
                          onChange={(e) => handleChange('valorMatricula', e.target.value)}
                        />
                        <FieldError>{errors.valorMatricula}</FieldError>
                      </TextField>

                      <TextField>
                        <Label>Fecha límite de respuesta</Label>
                        <Input
                          type="date"
                          value={formData.fechaLimiteRespuesta}
                          onChange={(e) => handleChange('fechaLimiteRespuesta', e.target.value)}
                        />
                      </TextField>
                    </div>

                    <TextField>
                      <Label>Código de estudiante</Label>
                      <Input
                        placeholder="Se asigna al matricular"
                        value={formData.codigoEstudiante}
                        onChange={(e) => handleChange('codigoEstudiante', e.target.value)}
                      />
                    </TextField>

                    <div className="space-y-3 rounded-lg border border-default-200 p-3">
                      <p className="text-sm font-medium text-default-600">Validación de requisitos</p>
                      {(
                        [
                          ['bachillerValidado', 'Título de bachiller validado'],
                          ['icfesValidado', 'Resultado ICFES validado'],
                          ['requisitosValidados', 'Requisitos completos'],
                        ] as const
                      ).map(([field, label]) => (
                        <Switch
                          key={field}
                          isSelected={formData[field]}
                          onChange={(value) => handleChange(field, value)}
                        >
                          <Switch.Control className="data-[selected]:bg-success">
                            <Switch.Thumb />
                          </Switch.Control>
                          <Switch.Content>
                            <Label>{label}</Label>
                          </Switch.Content>
                        </Switch>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </Modal.Body>

            <Modal.Footer>
              <Button variant="danger-soft" onPress={onClose} isDisabled={isSubmitting}>
                Cancelar
              </Button>
              <Button variant="primary" onPress={handleSubmit} isPending={isSubmitting}>
                {isEditing ? 'Guardar Cambios' : 'Crear Solicitud'}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};
