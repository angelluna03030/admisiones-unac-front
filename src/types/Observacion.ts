export interface Observacion {
  id: string;
  solicitudId: string;
  motivo: string;
  detalle: string | null;
  resuelta: boolean;
  emitidaPorId: string;
  createdAt: string;
  solicitud: {
    id: string;
    codigo: string;
    estado: string;
    aspirante: { nombres: string; apellidos: string; numeroDocumento: string; telefono: string | null };
    programa: { nombre: string };
  };
  emitidaPor: { id: string; nombres: string; apellidos: string; rol: string };
}

/** Motivos frecuentes para agilizar el registro (también se puede escribir uno propio). */
export const MOTIVOS_FRECUENTES = [
  'Documento de identidad ilegible',
  'Falta el certificado de bachiller',
  'Resultado ICFES incompleto',
  'Foto no cumple los requisitos',
  'Datos personales inconsistentes',
  'Pago de inscripción no verificado',
];

export interface CreateObservacionDto {
  solicitudId: string;
  motivo: string;
  detalle?: string | null;
  notificarWhatsapp?: boolean;
}

export interface UpdateObservacionDto {
  motivo?: string;
  detalle?: string | null;
}

export interface FindAllObservacionesQuery {
  resuelta?: boolean;
  solicitudId?: string;
}

export type ResultadoWhatsapp = 'ENVIADO' | 'SIN_TELEFONO' | 'ERROR' | 'NO_SOLICITADO';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  whatsapp?: ResultadoWhatsapp;
}
