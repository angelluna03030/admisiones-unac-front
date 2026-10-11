/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react';
import { Button, Input, Label, Modal, TextField, toast } from '@heroui/react';
import { entrevistaApi } from '../../../api/entrevista';
import { useEntrevista } from '../../../hooks/useEntrevista';
import {
  CRITERIOS_ACADEMICA,
  CRITERIOS_CAPELLANIA,
  type Entrevista,
} from '../../../types/Entrevista';

interface EvaluacionModalProps {
  entrevista: Entrevista | null;
  onClose: () => void;
}

const ESCALA = [1, 2, 3, 4, 5];
const ACTIVE_STYLE = { backgroundColor: 'var(--accent)', color: 'var(--accent-foreground)' };

export const EvaluacionModal = ({ entrevista, onClose }: EvaluacionModalProps) => {
  const { evaluarEntrevista } = useEntrevista();
  const esCapellania = entrevista?.tipo === 'CAPELLANIA';
  const criterios = esCapellania ? CRITERIOS_CAPELLANIA : CRITERIOS_ACADEMICA;

  const [puntajes, setPuntajes] = useState<Record<string, number>>({});
  const [textos, setTextos] = useState({ observaciones: '', conceptoAcademico: '', recomendacionFinal: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Si la entrevista ya fue evaluada, se precargan los valores para corregirlos
  useEffect(() => {
    if (!entrevista) return;
    setPuntajes({});
    setTextos({ observaciones: '', conceptoAcademico: '', recomendacionFinal: '' });
    if (!entrevista.evaluacionCapellania && !entrevista.evaluacionAcademica) return;

    entrevistaApi.getById(entrevista.id).then((data) => {
      const evaluacion = data.evaluacionCapellania ?? data.evaluacionAcademica;
      if (!evaluacion) return;
      const valores: Record<string, number> = {};
      [...CRITERIOS_CAPELLANIA, ...CRITERIOS_ACADEMICA].forEach((c) => {
        if (typeof evaluacion[c.id] === 'number') valores[c.id] = evaluacion[c.id];
      });
      setPuntajes(valores);
      setTextos({
        observaciones: evaluacion.observaciones ?? '',
        conceptoAcademico: evaluacion.conceptoAcademico ?? '',
        recomendacionFinal: evaluacion.recomendacionFinal ?? '',
      });
    });
  }, [entrevista]);

  const completos = criterios.every((c) => puntajes[c.id]);
  const promedio = completos
    ? criterios.reduce((acc, c) => acc + (puntajes[c.id] ?? 0), 0) / criterios.length
    : null;

  const handleSubmit = async () => {
    if (!entrevista || !completos) return;
    setIsSubmitting(true);
    try {
      const payload = esCapellania
        ? { ...puntajes, observaciones: textos.observaciones.trim() || null }
        : {
            ...puntajes,
            conceptoAcademico: textos.conceptoAcademico.trim() || null,
            recomendacionFinal: textos.recomendacionFinal.trim() || null,
          };
      await evaluarEntrevista(entrevista.id, payload);
      toast.success('Evaluación registrada', {
        description: `Promedio ${promedio?.toFixed(2)} / 5. La entrevista quedó completada.`,
      });
      onClose();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.danger('Error', { description: error?.response?.data?.message || 'No se pudo registrar la evaluación.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal>
      <Modal.Backdrop isOpen={!!entrevista} onOpenChange={(open) => { if (!open) onClose(); }}>
        <Modal.Container placement="center" size="md" scroll="inside">
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>
                Evaluación {esCapellania ? 'de Capellanía' : 'Académica'}
              </Modal.Heading>
            </Modal.Header>

            <Modal.Body>
              {entrevista && (
                <div className="space-y-5">
                  <p className="text-sm text-default-500">
                    {entrevista.solicitud.aspirante.nombres} {entrevista.solicitud.aspirante.apellidos} ·{' '}
                    {entrevista.solicitud.programa.nombre}
                  </p>

                  {criterios.map((criterio) => (
                    <div key={criterio.id}>
                      <p className="mb-2 text-sm font-medium">{criterio.label}</p>
                      <div className="flex gap-2" role="radiogroup" aria-label={criterio.label}>
                        {ESCALA.map((valor) => {
                          const activo = puntajes[criterio.id] === valor;
                          return (
                            <button
                              key={valor}
                              type="button"
                              role="radio"
                              aria-checked={activo}
                              onClick={() => setPuntajes((prev) => ({ ...prev, [criterio.id]: valor }))}
                              // Color inline: el preflight de HeroUI anula bg-* en <button>
                              style={activo ? ACTIVE_STYLE : undefined}
                              className={`h-9 w-9 rounded-lg border text-sm font-semibold transition-colors ${
                                activo ? 'border-transparent' : 'border-default-300 text-default-600 hover:bg-default-100'
                              }`}
                            >
                              {valor}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  {esCapellania ? (
                    <TextField>
                      <Label>Observaciones</Label>
                      <Input
                        value={textos.observaciones}
                        onChange={(e) => setTextos((prev) => ({ ...prev, observaciones: e.target.value }))}
                      />
                    </TextField>
                  ) : (
                    <>
                      <TextField>
                        <Label>Concepto académico</Label>
                        <Input
                          value={textos.conceptoAcademico}
                          onChange={(e) => setTextos((prev) => ({ ...prev, conceptoAcademico: e.target.value }))}
                        />
                      </TextField>
                      <TextField>
                        <Label>Recomendación final</Label>
                        <Input
                          value={textos.recomendacionFinal}
                          onChange={(e) => setTextos((prev) => ({ ...prev, recomendacionFinal: e.target.value }))}
                        />
                      </TextField>
                    </>
                  )}

                  <div className="flex items-center justify-between rounded-lg bg-default-100 p-3">
                    <span className="text-sm text-default-600">Promedio</span>
                    <span className="text-xl font-bold">{promedio ? `${promedio.toFixed(2)} / 5` : '—'}</span>
                  </div>
                </div>
              )}
            </Modal.Body>

            <Modal.Footer>
              <Button variant="danger-soft" onPress={onClose} isDisabled={isSubmitting}>
                Cancelar
              </Button>
              <Button variant="primary" onPress={handleSubmit} isPending={isSubmitting} isDisabled={!completos}>
                Guardar Evaluación
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};
