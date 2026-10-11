/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import {
  Modal,
  Button,
  TextField,
  Input,
  Label,
  FieldError,
  Select,
  ListBox,
  Switch,
  toast,
  type Key,
} from '@heroui/react';
import { useUsuario } from '../../../hooks/useUsuario';
import { createUsuarioSchema, type CreateUsuarioDto } from '../../../types/Usuario';

const ROLES = [
  { id: 'ADMISIONES', label: 'Admisiones' },
  { id: 'CAPELLAN', label: 'Capellán' },
  { id: 'COORDINADOR_PROGRAMA', label: 'Coordinador de Programa' },
  { id: 'VICERRECTORIA', label: 'Vicerrectoría' },
  { id: 'OFICINA_FINANCIERA', label: 'Oficina Financiera' },
  { id: 'REGISTRO_ACADEMICO', label: 'Registro Académico' },
  { id: 'ADMIN', label: 'Administrador' },
];

interface UsuarioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UsuarioModal = ({ isOpen, onClose }: UsuarioModalProps) => {
  const { selectedUsuario, createUsuario, updateUsuario } = useUsuario();
  const isEditing = !!selectedUsuario;

  const [formData, setFormData] = useState<CreateUsuarioDto>({
    nombres: '',
    apellidos: '',
    correo: '',
    rol: 'ADMISIONES',
    activo: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (selectedUsuario) {
        setFormData({
          nombres: selectedUsuario.nombres,
          apellidos: selectedUsuario.apellidos,
          correo: selectedUsuario.correo,
          rol: selectedUsuario.rol,
          activo: selectedUsuario.activo,
          password: '',
        });
      } else {
        setFormData({
          nombres: '',
          apellidos: '',
          correo: '',
          rol: 'ADMISIONES',
          activo: true,
          password: '',
        });
      }
      setErrors({});
    }
  }, [selectedUsuario, isOpen]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (field: keyof CreateUsuarioDto, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = async () => {
    // La contraseña vacía significa "no asignar / no cambiar"
    const payload = { ...formData, password: formData.password || undefined };
    const validation = createUsuarioSchema.safeParse(payload);
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setIsSubmitting(true);
    try {
      if (isEditing && selectedUsuario) {
        await updateUsuario(selectedUsuario.id, payload);
        toast.success('Usuario actualizado', {
          description: 'Los cambios se guardaron correctamente.',
        });
      } else {
        await createUsuario(payload);
        toast.success('Usuario creado', {
          description: 'El usuario se registró en el sistema.',
        });
      }
      onClose();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'Ocurrió un error al guardar.';
      toast.danger('Error', {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal>
      <Modal.Backdrop isOpen={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
        <Modal.Container placement="center" size="md">
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>{isEditing ? 'Editar Usuario' : 'Nuevo Usuario'}</Modal.Heading>
            </Modal.Header>

            <Modal.Body>
              <div className="space-y-4">
                <TextField isInvalid={!!errors.nombres}>
                  <Label>Nombres</Label>
                  <Input
                    placeholder="Ej. Juan Carlos"
                    value={formData.nombres}
                    onChange={(e) => handleChange('nombres', e.target.value)}
                  />
                  <FieldError>{errors.nombres}</FieldError>
                </TextField>

                <TextField isInvalid={!!errors.apellidos}>
                  <Label>Apellidos</Label>
                  <Input
                    placeholder="Ej. Pérez López"
                    value={formData.apellidos}
                    onChange={(e) => handleChange('apellidos', e.target.value)}
                  />
                  <FieldError>{errors.apellidos}</FieldError>
                </TextField>

                <TextField isInvalid={!!errors.correo}>
                  <Label>Correo Electrónico</Label>
                  <Input
                    type="email"
                    placeholder="ejemplo@correo.com"
                    value={formData.correo}
                    onChange={(e) => handleChange('correo', e.target.value)}
                  />
                  <FieldError>{errors.correo}</FieldError>
                </TextField>

                <Select
                  placeholder="Selecciona un rol"
                  value={formData.rol as Key}
                  onChange={(key) => handleChange('rol', key)}
                  isInvalid={!!errors.rol}
                >
                  <Label>Rol</Label>
                  <Select.Trigger>
                    <Select.Value />
                    <Select.Indicator />
                  </Select.Trigger>
                  <Select.Popover>
                    <ListBox>
                      {ROLES.map((rol) => (
                        <ListBox.Item key={rol.id} id={rol.id} textValue={rol.label}>
                          {rol.label}
                          <ListBox.ItemIndicator />
                        </ListBox.Item>
                      ))}
                    </ListBox>
                  </Select.Popover>
                  <FieldError>{errors.rol}</FieldError>
                </Select>

                <TextField isInvalid={!!errors.password}>
                  <Label>{isEditing ? 'Nueva contraseña' : 'Contraseña de acceso'}</Label>
                  <Input
                    type="password"
                    autoComplete="new-password"
                    placeholder={isEditing ? 'Déjala vacía para no cambiarla' : 'Opcional: sin ella no podrá iniciar sesión'}
                    value={formData.password ?? ''}
                    onChange={(e) => handleChange('password', e.target.value)}
                  />
                  <FieldError>{errors.password}</FieldError>
                </TextField>
                {isEditing && selectedUsuario && (
                  <p className="-mt-2 text-xs text-default-500">
                    {selectedUsuario.tieneAcceso
                      ? 'Este usuario ya tiene contraseña asignada.'
                      : 'Este usuario aún no tiene contraseña: asígnale una para que pueda entrar.'}
                  </p>
                )}

                <Switch isSelected={formData.activo} onChange={(val) => handleChange('activo', val)}>
                  <Switch.Control className="data-[selected]:bg-success">
                    <Switch.Thumb />
                  </Switch.Control>
                  <Switch.Content>
                    <Label>Usuario Activo</Label>
                  </Switch.Content>
                </Switch>
              </div>
            </Modal.Body>

            <Modal.Footer>
              <Button variant="danger-soft" onPress={onClose} isDisabled={isSubmitting}>
                Cancelar
              </Button>
              <Button variant="primary" onPress={handleSubmit} isPending={isSubmitting}>
                {isEditing ? 'Guardar Cambios' : 'Crear Usuario'}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};