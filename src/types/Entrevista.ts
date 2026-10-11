import { z } from 'zod';

export type TipoEntrevista = 'CAPELLANIA' | 'ACADEMICA';
export type EstadoEntrevista = 'PENDIENTE' | 'REPROGRAMADA' | 'COMPLETADA' | 'CANCELADA';

export const TIPOS_ENTREVISTA: { id: TipoEntrevista; label: string }[] = [
  { id: 'CAPELLANIA', label: 'Capellanía' },
  { id: 'ACADEMICA', label: 'Académica' },
];

export const ESTADOS_ENTREVISTA: {
  id: EstadoEntrevista;
  label: string;
  color: 'default' | 'accent' | 'success' | 'warning' | 'danger';
}[] = [
  { id: 'PENDIENTE', label: 'Pendiente', color: 'accent' },
  { id: 'REPROGRAMADA', label: 'Reprogramada', color: 'warning' },
  { id: 'COMPLETADA', label: 'Completada', color: 'success' },
  { id: 'CANCELADA', label: 'Cancelada', color: 'danger' },
];

export const MODALIDADES = ['Presencial', 'Virtual'];

// Criterios de las rúbricas (1 a 5), tal como están en el schema de Prisma
export const CRITERIOS_CAPELLANIA = [
  { id: 'valoresPrincipiosEticos', label: 'Valores y principios éticos' },
  { id: 'proyectoDeVida', label: 'Proyecto de vida' },
  { id: 'convivenciaComunitaria', label: 'Convivencia comunitaria' },
  { id: 'compromisoReglamento', label: 'Compromiso con el Manual de Convivencia' },
  { id: 'actitudDisposicion', label: 'Actitud y disposición' },
] as const;

export const CRITERIOS_ACADEMICA = [
  { id: 'aptitudAcademica', label: 'Aptitud académica' },
  { id: 'perfilParaElPrograma', label: 'Perfil para el programa' },
  { id: 'habilidadesComunicacion', label: 'Habilidades de comunicación' },
  { id: 'pensamientoCritico', label: 'Pensamiento crítico' },
  { id: 'motivacionIntrinseca', label: 'Motivación intrínseca' },
] as const;

export const createEntrevistaSchema = z.object({
  solicitudId: z.string().min(1, 'Selecciona una solicitud'),
  tipo: z.enum(['CAPELLANIA', 'ACADEMICA']),
  evaluadorId: z.string().nullable().optional(),
  fechaProgramada: z.string().min(1, 'La fecha programada es requerida'),
  modalidad: z.string().nullable().optional(),
  lugarOEnlace: z.string().nullable().optional(),
});

export type CreateEntrevistaDto = z.infer<typeof createEntrevistaSchema>;

export type UpdateEntrevistaDto = Partial<CreateEntrevistaDto> & {
  estado?: EstadoEntrevista;
  fechaRealizada?: string | null;
  motivoReprogramacion?: string | null;
};

export interface Entrevista {
  id: string;
  solicitudId: string;
  tipo: TipoEntrevista;
  estado: EstadoEntrevista;
  evaluadorId: string | null;
  fechaProgramada: string | null;
  fechaRealizada: string | null;
  modalidad: string | null;
  lugarOEnlace: string | null;
  motivoReprogramacion: string | null;
  createdAt: string;
  solicitud: {
    id: string;
    codigo: string;
    estado: string;
    aspirante: { nombres: string; apellidos: string; numeroDocumento: string };
    programa: { nombre: string };
  };
  evaluador: { id: string; nombres: string; apellidos: string; rol: string } | null;
  evaluacionCapellania: { promedio: string } | null;
  evaluacionAcademica: { promedio: string } | null;
}

export type EvaluacionPayload = Record<string, number | string | null>;

export interface FindAllEntrevistasQuery {
  estado?: EstadoEntrevista;
  tipo?: TipoEntrevista;
  solicitudId?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
