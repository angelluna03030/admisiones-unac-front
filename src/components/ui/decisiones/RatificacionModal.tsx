/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react';
import { Button, Chip, FieldError, Label, Modal, TextArea, TextField, toast } from '@heroui/react';
import { useAuthStore } from '../../../stores/authStore';
import { useDecision } from '../../../hooks/useDecision';
import {
  getTipoDecision,
  promedioEntrevista,
  type Decision,
} from '../../../types/Decision';

interface RatificacionModalProps {
  decision: Decision | null;
  onClose: () => void;
}

// Qué pasa con la solicitud según la decisión ratificada
const RESULTADO_RATIFICADA: Record<string, string> = {
  NOTIFICAR_ADMISION: 'La solicitud pasa a Admitido.',
  RECHAZAR: 'La solicitud pasa a Rechazado.',
  SOLICITAR_CORRECCION_PERFIL: 'La solicitud se mantiene en Corrección de perfil.',
};

export const RatificacionModal = ({ decision, onClose }: RatificacionModalProps) => {
  const { ratificarDecision } = useDecision();
  const [ratifica, setRatifica] = useState(true);
  const [comentario, setComentario] = useState('');
  const usuario = useAuthStore((state) => state.usuario);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!decision) return;
    setRatifica(true);
    setComentario('');
    setErrors({});
  }, [decision]);

  const handleSubmit = async () => {
    if (!decision) return;
    const nextErrors: Record<string, string> = {};
    if (!ratifica && !comentario.trim()) nextErrors.comentario = 'Indica por qué no se ratifica';
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await ratificarDecision(decision.id, {
        estadoRatificacion: ratifica ? 'RATIFICADA' : 'RECHAZADA',
        comentarioRatificacion: comentario.trim() || null,
      });
      toast.success(ratifica ? 'Decisión ratificada' : 'Decisión no ratificada', {
        description: ratifica
          ? RESULTADO_RATIFICADA[decision.tipo]
          : 'La solicitud vuelve a corrección de perfil.',
      });
      onClose();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.danger('Error', { description: error?.response?.data?.message || 'No se pudo registrar la ratificación.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const tipo = decision ? getTipoDecision(decision.tipo) : undefined;
  const capellania = decision ? promedioEntrevista(decision, 'CAPELLANIA') : null;
  const academica = decision ? promedioEntrevista(decision, 'ACADEMICA') : null;

  return (
    <Modal>
      <Modal.Backdrop isOpen={!!decision} onOpenChange={(open) => { if (!open) onClose(); }}>
        <Modal.Container placement="center" size="md" scroll="inside">
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>Ratificación de Vicerrectoría</Modal.Heading>
            </Modal.Header>

            <Modal.Body>
              {decision && (
                <div className="space-y-4">
                  <div className="space-y-2 rounded-lg bg-default-100 p-3 text-sm">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium">
                          {decision.solicitud.aspirante.nombres} {decision.solicitud.aspirante.apellidos}
                        </p>
                        <p className="text-xs text-default-500">{decision.solicitud.programa.nombre}</p>
                      </div>
                      <Chip size="sm" variant="soft" color={tipo?.color ?? 'default'}>
                        {tipo?.label}
                      </Chip>
                    </div>
                    <p className="text-xs text-default-600">
                      Capellanía: <strong>{capellania?.toFixed(1) ?? '—'}</strong> · Académica:{' '}
                      <strong>{academica?.toFixed(1) ?? '—'}</strong> · Coordinación: {decision.tomadaPor.nombres}{' '}
                      {decision.tomadaPor.apellidos}
                    </p>
                    {decision.justificacion && (
                      <p className="text-xs italic text-default-600">“{decision.justificacion}”</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      aria-pressed={ratifica}
                      onClick={() => setRatifica(true)}
                      className={`rounded-xl border-2 p-3 text-left transition ${
                        ratifica ? 'border-success bg-success/10' : 'border-default-200 hover:border-default-300'
                      }`}
                    >
                      <p className="text-sm font-semibold">Ratificar</p>
                      <p className="text-xs text-default-500">{RESULTADO_RATIFICADA[decision.tipo]}</p>
                    </button>
                    <button
                      type="button"
                      aria-pressed={!ratifica}
                      onClick={() => setRatifica(false)}
                      className={`rounded-xl border-2 p-3 text-left transition ${
                        !ratifica ? 'border-danger bg-danger/10' : 'border-default-200 hover:border-default-300'
                      }`}
                    >
                      <p className="text-sm font-semibold">No ratificar</p>
                      <p className="text-xs text-default-500">La solicitud vuelve a corrección de perfil.</p>
                    </button>
                  </div>

                  {usuario && (
                    <p className="text-xs text-default-500">
                      Se registrará como revisada por{' '}
                      <strong>
                        {usuario.nombres} {usuario.apellidos}
                      </strong>
                      .
                    </p>
                  )}

                  <TextField isInvalid={!!errors.comentario}>
                    <Label>Comentario {ratifica ? '(opcional)' : ''}</Label>
                    <TextArea
                      rows={3}
                      placeholder={ratifica ? 'Observaciones de Vicerrectoría' : 'Motivo por el que no se ratifica'}
                      value={comentario}
                      onChange={(e) => {
                        setComentario(e.target.value);
                        setErrors((prev) => ({ ...prev, comentario: '' }));
                      }}
                    />
                    <FieldError>{errors.comentario}</FieldError>
                  </TextField>
                </div>
              )}
            </Modal.Body>

            <Modal.Footer>
              <Button variant="danger-soft" onPress={onClose} isDisabled={isSubmitting}>
                Cancelar
              </Button>
              <Button variant="primary" onPress={handleSubmit} isPending={isSubmitting}>
                {ratifica ? 'Ratificar' : 'No ratificar'}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};
