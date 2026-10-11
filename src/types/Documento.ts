export type TipoDocumento =
  | 'DOCUMENTO_IDENTIDAD'
  | 'FOTO'
  | 'CERTIFICADO_BACHILLER'
  | 'RESULTADO_ICFES'
  | 'OTRO';

export type EstadoDocumento = 'PENDIENTE' | 'CARGADO' | 'VALIDADO' | 'RECHAZADO';

type ChipColor = 'default' | 'accent' | 'success' | 'warning' | 'danger';

export const TIPOS_DOCUMENTO: { id: TipoDocumento; label: string; obligatorio: boolean }[] = [
  { id: 'DOCUMENTO_IDENTIDAD', label: 'Documento de identidad', obligatorio: true },
  { id: 'FOTO', label: 'Foto', obligatorio: true },
  { id: 'CERTIFICADO_BACHILLER', label: 'Certificado de bachiller', obligatorio: true },
  { id: 'RESULTADO_ICFES', label: 'Resultado ICFES', obligatorio: true },
  { id: 'OTRO', label: 'Otro', obligatorio: false },
];

export const ESTADOS_DOCUMENTO: { id: EstadoDocumento; label: string; color: ChipColor }[] = [
  { id: 'PENDIENTE', label: 'Pendiente', color: 'default' },
  { id: 'CARGADO', label: 'Por validar', color: 'accent' },
  { id: 'VALIDADO', label: 'Validado', color: 'success' },
  { id: 'RECHAZADO', label: 'Rechazado', color: 'danger' },
];

export const getTipoDocumento = (tipo: string) =>
  TIPOS_DOCUMENTO.find((t) => t.id === tipo)?.label ?? tipo;

export const getEstadoDocumento = (estado: string) =>
  ESTADOS_DOCUMENTO.find((e) => e.id === estado) ?? { id: estado, label: estado, color: 'default' as ChipColor };

export interface Documento {
  id: string;
  solicitudId: string;
  tipo: TipoDocumento;
  estado: EstadoDocumento;
  urlArchivo: string | null;
  observacion: string | null;
  cargadoEn: string | null;
  validadoEn: string | null;
  createdAt: string;
  updatedAt: string;
  solicitud: {
    id: string;
    codigo: string;
    estado: string;
    aspirante: { nombres: string; apellidos: string; numeroDocumento: string };
    programa: { nombre: string };
  };
}

export interface CreateDocumentoDto {
  solicitudId: string;
  tipo: TipoDocumento;
  urlArchivo?: string | null;
  observacion?: string | null;
}

export interface UpdateDocumentoDto {
  urlArchivo?: string | null;
  observacion?: string | null;
}

export interface FindAllDocumentosQuery {
  estado?: EstadoDocumento;
  tipo?: TipoDocumento;
  solicitudId?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
