/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react';
import { Button, FieldError, Input, Label, Modal, TextField, toast } from '@heroui/react';
import { authApi } from '../../api/auth';

interface CambiarPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EMPTY = { actual: '', nueva: '', confirmar: '' };

export const CambiarPasswordModal = ({ isOpen, onClose }: CambiarPasswordModalProps) => {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setForm(EMPTY);
    setErrors({});
  }, [isOpen]);

  const handleSubmit = async () => {
    const next: Record<string, string> = {};
    if (!form.actual) next.actual = 'Ingresa tu contraseña actual';
    if (form.nueva.length < 8 || !/[A-Za-z]/.test(form.nueva) || !/\d/.test(form.nueva)) {
      next.nueva = 'Mínimo 8 caracteres, con al menos una letra y un número';
    }
    if (form.confirmar !== form.nueva) next.confirmar = 'Las contraseñas no coinciden';
    if (Object.keys(next).length) {
      setErrors(next);
      return;
    }

    setIsSubmitting(true);
    try {
      await authApi.cambiarPassword(form.actual, form.nueva);
      toast.success('Contraseña actualizada', { description: 'Úsala la próxima vez que inicies sesión.' });
      onClose();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.danger('Error', { description: error?.response?.data?.message || 'No se pudo cambiar la contraseña.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const campo = (key: keyof typeof EMPTY, label: string, autoComplete: string) => (
    <TextField isInvalid={!!errors[key]}>
      <Label>{label}</Label>
      <Input
        type="password"
        autoComplete={autoComplete}
        value={form[key]}
        onChange={(e) => {
          setForm((prev) => ({ ...prev, [key]: e.target.value }));
          setErrors((prev) => ({ ...prev, [key]: '' }));
        }}
      />
      <FieldError>{errors[key]}</FieldError>
    </TextField>
  );

  return (
    <Modal>
      <Modal.Backdrop isOpen={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
        <Modal.Container placement="center" size="sm">
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>Cambiar contraseña</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <div className="space-y-4">
                {campo('actual', 'Contraseña actual', 'current-password')}
                {campo('nueva', 'Nueva contraseña', 'new-password')}
                {campo('confirmar', 'Confirmar nueva contraseña', 'new-password')}
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="danger-soft" onPress={onClose} isDisabled={isSubmitting}>
                Cancelar
              </Button>
              <Button variant="primary" onPress={handleSubmit} isPending={isSubmitting}>
                Guardar
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};
