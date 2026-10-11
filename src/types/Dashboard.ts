export interface DashboardKPIs {
  /** 'periodo_anterior' con rango de fechas; 'ultimos_30_dias' sin rango */
  comparacion: 'periodo_anterior' | 'ultimos_30_dias';

  totalSolicitudes: number;
  variacionSolicitudes: number;
  totalAspirantes: number;
  enProceso: number;

  totalAdmitidos: number;
  totalRechazados: number;
  tasaAdmision: number;

  totalMatriculados: number;
  tasaConversion: number;
  variacionConversion: number;

  ingresosInscripcion: number;
  ingresosMatricula: number;
  ingresosTotales: number;
  variacionIngresos: number;

  promedioIcfes: number | null;
  promedioDiasProceso: number | null;

  entrevistasRealizadas: number;
  entrevistasPendientes: number;
  promedioCapellania: number | null;
  promedioAcademica: number | null;
}

export interface FunnelData {
  estado: string;
  cantidad: number;
}

export interface ConversionData {
  etapa: string;
  cantidad: number;
  porcentajeTotal: number;
  porcentajeEtapaAnterior: number;
}

export interface DashboardAlerts {
  solicitudesObservadas: number;
  entrevistasProximaSemana: number;
  entrevistasVencidas: number;
  documentosPorValidar: number;
  ratificacionesPendientes: number;
  solicitudesEstancadas: number;
  respuestasVencidas: number;
}

export interface TrendData {
  period: string;
  total_solicitudes: number;
  admitidos: number;
  matriculados: number;
  rechazados: number;
  ingresos_matricula: number;
  ingresos_inscripcion: number;
}

export interface ProgramMetric {
  programaId: string;
  nombre: string;
  codigo: string;
  facultad: string | null;
  jornada: string | null;
  totalSolicitudes: number;
  enProceso: number;
  admitidos: number;
  matriculados: number;
  rechazados: number;
  tasaConversion: number;
  promedioIcfes: number | null;
  ingresos: number;
}

export interface DashboardActivity {
  solicitudesRecientes: {
    id: string;
    codigo: string;
    estado: string;
    createdAt: string;
    aspirante: { nombres: string; apellidos: string };
    programa: { nombre: string };
  }[];
  proximasEntrevistas: {
    id: string;
    tipo: 'CAPELLANIA' | 'ACADEMICA';
    estado: string;
    fechaProgramada: string;
    modalidad: string | null;
    solicitud: { codigo: string; aspirante: { nombres: string; apellidos: string } };
    evaluador: { nombres: string; apellidos: string } | null;
  }[];
}

export type TrendGroupBy = 'day' | 'week' | 'month';

export interface DashboardFilters {
  startDate?: string;
  endDate?: string;
  programaId?: string;
  facultad?: string;
  jornada?: string;
  ciudad?: string;
  estado?: string;
  rol?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
