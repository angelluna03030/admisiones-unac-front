import { z } from 'zod';

export const rolUsuarioEnum = z.enum([
  'ADMISIONES', 'CAPELLAN', 'COORDINADOR_PROGRAMA', 
  'VICERRECTORIA', 'OFICINA_FINANCIERA', 'REGISTRO_ACADEMICO', 'ADMIN'
]);

export const createUsuarioSchema = z.object({
  nombres: z.string().min(2, 'Mínimo 2 caracteres'),
  apellidos: z.string().min(2, 'Mínimo 2 caracteres'),
  correo: z.email('Correo inválido'),
  rol: rolUsuarioEnum,
  activo: z.boolean().default(true),
  // Opcional: sin contraseña el usuario no puede iniciar sesión
  password: z
    .string()
    .min(8, 'Mínimo 8 caracteres')
    .regex(/[A-Za-z]/, 'Debe tener al menos una letra')
    .regex(/\d/, 'Debe tener al menos un número')
    .optional(),
});

export type Usuario = {
  id: string;
  nombres: string;
  apellidos: string;
  correo: string;
  rol: z.infer<typeof rolUsuarioEnum>;
  activo: boolean;
  tieneAcceso?: boolean;
  ultimoAcceso?: string | null;
  createdAt: string;
};

export type CreateUsuarioDto = z.infer<typeof createUsuarioSchema>;
export type UpdateUsuarioDto = Partial<CreateUsuarioDto>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ApiResponse<T> = { success: boolean; data?: T; message?: string; errors?: any };