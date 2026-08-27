export interface Aspirante {
  id: string;
  nombres: string;
  apellidos: string;
  tipoDocumento: string;
  numeroDocumento: string;
  correo: string;
  telefono: string | null;
  fechaNacimiento: string | null;
  direccion: string | null;
  ciudad: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAspiranteDto {
  nombres: string;
  apellidos: string;
  tipoDocumento: string;
  numeroDocumento: string;
  correo: string;
  telefono?: string;
  fechaNacimiento?: string;
  direccion?: string;
  ciudad?: string;
}

export type UpdateAspiranteDto = Partial<CreateAspiranteDto>

export interface FindAllAspirantesQuery {
  page?: number;
  limit?: number;
  search?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  total?: number;
  page?: number;
  limit?: number;
  message?: string;
}