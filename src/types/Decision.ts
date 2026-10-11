export type TipoDecision = 'NOTIFICAR_ADMISION' | 'SOLICITAR_CORRECCION_PERFIL' | 'RECHAZAR';
export type EstadoRatificacion = 'PENDIENTE' | 'RATIFICADA' | 'RECHAZADA';

type ChipColor = 'default' | 'accent' | 'success' | 'warning' | 'danger';

export const TIPOS_DECISION: { id: TipoDecision; label: string; descripcion: string; color: ChipColor }[] = [
  {
    id: 'NOTIFICAR_ADMISION',
    label: 'Admitir',
    descripcion: 'El aspirante cumple el perfil. Pasa a ratificación de Vicerrectoría.',
    color: 'success',
  },
  {
    id: 'SOLICITAR_CORRECCION_PERFIL',
    label: 'Corregir perfil',
    descripcion: 'Hay aspectos por ajustar antes de decidir. La solicitud vuelve a corrección.',
    color: 'warning',
  },
  {
    id: 'RECHAZAR',
    label: 'Rechazar',
    descripcion: 'El aspirante no cumple el perfil. Pasa a ratificación de Vicerrectoría.',
    color: 'danger',
  },
];

export const ESTADOS_RATIFICACION: { id: EstadoRatificacion; label: string; color: ChipColor }[] = [
  { id: 'PENDIENTE', label: 'Pendiente', color: 'warning' },
  { id: 'RATIFICADA', label: 'Ratificada', color: 'success' },
  { id: 'RECHAZADA', label: 'No ratificada', color: 'danger' },
];

export const getTipoDecision = (tipo: string) => TIPOS_DECISION.find((t) => t.id === tipo);
export const getEstadoRatificacion = (estado: string) => ESTADOS_RATIFICACION.find((e) => e.id === estado);

interface UsuarioResumen {
  id: string;
  nombres: string;
  apellidos: string;
  rol: string;
}

export interface Decision {
  id: string;
  solicitudId: string;
  tipo: TipoDecision;
  tomadaPorId: string;
  tomadaEn: string;
  justificacion: string | null;
  estadoRatificacion: EstadoRatificacion;
  ratificadaPorId: string | null;
  ratificadaEn: string | null;
  comentarioRatificacion: string | null;
  solicitud: {
    id: string;
    codigo: string;
    estado: string;
    aspirante: { nombres: string; apellidos: string; numeroDocumento: string };
    programa: { nombre: string };
    entrevistas: {
      tipo: 'CAPELLANIA' | 'ACADEMICA';
      estado: string;
      evaluacionCapellania: { promedio: string } | null;
      evaluacionAcademica: { promedio: string } | null;
    }[];
  };
  tomadaPor: UsuarioResumen;
  ratificadaPor: UsuarioResumen | null;
}

export interface CreateDecisionDto {
  solicitudId: string;
  tipo: TipoDecision;
  justificacion?: string | null;
}

export type UpdateDecisionDto = Partial<Omit<CreateDecisionDto, 'solicitudId'>>;

export interface RatificarDecisionDto {
  estadoRatificacion: 'RATIFICADA' | 'RECHAZADA';
  comentarioRatificacion?: string | null;
}

export interface FindAllDecisionesQuery {
  tipo?: TipoDecision;
  estadoRatificacion?: EstadoRatificacion;
  solicitudId?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/** Promedio de la entrevista de un tipo, si ya fue evaluada. */
export const promedioEntrevista = (decision: Decision, tipo: 'CAPELLANIA' | 'ACADEMICA') => {
  const entrevista = decision.solicitud.entrevistas.find((e) => e.tipo === tipo && e.estado === 'COMPLETADA');
  const promedio = entrevista?.evaluacionCapellania?.promedio ?? entrevista?.evaluacionAcademica?.promedio;
  return promedio ? Number(promedio) : null;
};
