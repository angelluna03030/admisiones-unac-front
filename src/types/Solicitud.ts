import type { EstadoEntrevista, TipoEntrevista } from './Entrevista';

export type EstadoSolicitud =
  | 'FORMULARIO_COMPLETADO'
  | 'PAGO_INSCRIPCION'
  | 'DOCUMENTOS_CARGADOS'
  | 'VALIDACION_REQUISITOS'
  | 'OBSERVADO'
  | 'ADMITIDO_PRELIMINAR'
  | 'EN_ENTREVISTA_CAPELLANIA'
  | 'EN_ENTREVISTA_ACADEMICA'
  | 'CORRECCION_PERFIL'
  | 'EN_RATIFICACION'
  | 'ADMITIDO'
  | 'RECHAZADO'
  | 'MATRICULADO'
  | 'CUENTA_ACTIVADA'
  | 'ARCHIVADO';

type ChipColor = 'default' | 'accent' | 'success' | 'warning' | 'danger';

// Orden del proceso (BPMN) con etiqueta legible y color del chip
export const ESTADOS_SOLICITUD: { id: EstadoSolicitud; label: string; color: ChipColor }[] = [
  { id: 'FORMULARIO_COMPLETADO', label: 'Formulario completado', color: 'default' },
  { id: 'PAGO_INSCRIPCION', label: 'Pago de inscripción', color: 'default' },
  { id: 'DOCUMENTOS_CARGADOS', label: 'Documentos cargados', color: 'default' },
  { id: 'VALIDACION_REQUISITOS', label: 'Validación de requisitos', color: 'accent' },
  { id: 'OBSERVADO', label: 'Observado', color: 'warning' },
  { id: 'ADMITIDO_PRELIMINAR', label: 'Admitido preliminar', color: 'accent' },
  { id: 'EN_ENTREVISTA_CAPELLANIA', label: 'Entrevista Capellanía', color: 'accent' },
  { id: 'EN_ENTREVISTA_ACADEMICA', label: 'Entrevista Académica', color: 'accent' },
  { id: 'CORRECCION_PERFIL', label: 'Corrección de perfil', color: 'warning' },
  { id: 'EN_RATIFICACION', label: 'En ratificación', color: 'warning' },
  { id: 'ADMITIDO', label: 'Admitido', color: 'success' },
  { id: 'MATRICULADO', label: 'Matriculado', color: 'success' },
  { id: 'CUENTA_ACTIVADA', label: 'Cuenta activada', color: 'success' },
  { id: 'RECHAZADO', label: 'Rechazado', color: 'danger' },
  { id: 'ARCHIVADO', label: 'Archivado', color: 'default' },
];

export const getEstadoSolicitud = (estado: string) =>
  ESTADOS_SOLICITUD.find((e) => e.id === estado) ?? {
    id: estado as EstadoSolicitud,
    label: estado.replace(/_/g, ' '),
    color: 'default' as ChipColor,
  };

export interface SolicitudResumen {
  id: string;
  codigo: string;
  estado: EstadoSolicitud;
  puntajeIcfes: number | null;
  requisitosValidados: boolean;
  createdAt: string;
  updatedAt: string;
  aspirante: {
    id: string;
    nombres: string;
    apellidos: string;
    tipoDocumento: string;
    numeroDocumento: string;
    correo: string;
  };
  programa: { id: string; nombre: string; codigo: string };
  _count: { entrevistas: number; documentos: number };
}

export interface SolicitudDetalle {
  id: string;
  codigo: string;
  estado: EstadoSolicitud;
  formularioCompletadoEn: string | null;
  pagoInscripcionEn: string | null;
  valorPagoInscripcion: string | null;
  bachillerValidado: boolean;
  puntajeIcfes: number | null;
  icfesValidado: boolean;
  requisitosValidados: boolean;
  fechaValidacion: string | null;
  aprobadoPreliminarEn: string | null;
  fechaLimiteRespuesta: string | null;
  matriculaPagadaEn: string | null;
  valorMatricula: string | null;
  cuentaActivadaEn: string | null;
  codigoEstudiante: string | null;
  archivadoEn: string | null;
  createdAt: string;
  updatedAt: string;
  aspirante: {
    id: string;
    nombres: string;
    apellidos: string;
    tipoDocumento: string;
    numeroDocumento: string;
    correo: string;
    telefono: string | null;
    ciudad: string | null;
  };
  programa: { id: string; nombre: string; codigo: string; facultad: string | null; jornada: string | null };
  documentos: {
    id: string;
    tipo: string;
    estado: 'PENDIENTE' | 'CARGADO' | 'VALIDADO' | 'RECHAZADO';
    urlArchivo: string | null;
    observacion: string | null;
  }[];
  entrevistas: {
    id: string;
    tipo: TipoEntrevista;
    estado: EstadoEntrevista;
    fechaProgramada: string | null;
    fechaRealizada: string | null;
    modalidad: string | null;
    evaluador: { id: string; nombres: string; apellidos: string } | null;
    evaluacionCapellania: { promedio: string } | null;
    evaluacionAcademica: { promedio: string } | null;
  }[];
  decisiones: {
    id: string;
    tipo: string;
    tomadaEn: string;
    justificacion: string | null;
    estadoRatificacion: string;
    tomadaPor: { nombres: string; apellidos: string };
  }[];
  observaciones: {
    id: string;
    motivo: string;
    detalle: string | null;
    resuelta: boolean;
    createdAt: string;
    emitidaPor: { nombres: string; apellidos: string };
  }[];
}

export interface CreateSolicitudDto {
  aspiranteId: string;
  programaId: string;
  puntajeIcfes?: number | null;
  valorPagoInscripcion?: number | null;
}

export interface UpdateSolicitudDto {
  programaId?: string;
  puntajeIcfes?: number | null;
  bachillerValidado?: boolean;
  icfesValidado?: boolean;
  requisitosValidados?: boolean;
  valorPagoInscripcion?: number | null;
  valorMatricula?: number | null;
  fechaLimiteRespuesta?: string | null;
  codigoEstudiante?: string | null;
}

export interface FindAllSolicitudesQuery {
  page?: number;
  limit?: number;
  search?: string;
  estado?: EstadoSolicitud;
  programaId?: string;
  aspiranteId?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  total?: number;
  page?: number;
  limit?: number;
  message?: string;
}
