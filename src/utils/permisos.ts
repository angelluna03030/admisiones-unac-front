import type { Usuario } from '../types/Usuario';

export type RolUsuario = Usuario['rol'];

/**
 * Acciones de escritura y los roles que pueden hacerlas (ADMIN siempre puede).
 * Debe coincidir con los requireRole de las rutas del backend.
 */
export const PERMISOS = {
  programas: ['ADMISIONES'],
  aspirantes: ['ADMISIONES'],
  solicitudes: ['ADMISIONES', 'OFICINA_FINANCIERA', 'REGISTRO_ACADEMICO'],
  entrevistas: ['ADMISIONES', 'CAPELLAN', 'COORDINADOR_PROGRAMA'],
  evaluarEntrevistas: ['CAPELLAN', 'COORDINADOR_PROGRAMA'],
  documentos: ['ADMISIONES'],
  decidir: ['COORDINADOR_PROGRAMA'],
  ratificar: ['VICERRECTORIA'],
  observaciones: ['ADMISIONES'],
  usuarios: [],
} satisfies Record<string, RolUsuario[]>;

export type Accion = keyof typeof PERMISOS;

export const puede = (rol: RolUsuario | undefined, accion: Accion) =>
  !!rol && (rol === 'ADMIN' || (PERMISOS[accion] as RolUsuario[]).includes(rol));

export const ROL_LABEL: Record<RolUsuario, string> = {
  ADMISIONES: 'Admisiones',
  CAPELLAN: 'Capellanía',
  COORDINADOR_PROGRAMA: 'Coordinación de Programa',
  VICERRECTORIA: 'Vicerrectoría',
  OFICINA_FINANCIERA: 'Oficina Financiera',
  REGISTRO_ACADEMICO: 'Registro Académico',
  ADMIN: 'Administrador',
};
