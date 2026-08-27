export interface ProgramaAcademico {
  id: string;
  nombre: string;
  codigo: string;
  facultad: string | null;
  jornada: string | null;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProgramaDto {
  nombre: string;
  codigo: string;
  facultad?: string;
  jornada?: string;
}

export type UpdateProgramaDto = Partial<CreateProgramaDto>

export interface FindAllProgramasQuery {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  total?: number;
  page?: number;
  limit?: number;
  message?: string;
}