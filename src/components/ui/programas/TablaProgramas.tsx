"use client";

import { useEffect } from "react";
import { Edit, Power } from "lucide-react";
import Swal from "sweetalert2";
import {
  Button,
  Chip,
  Pagination,
  Table,
} from "@heroui/react";
import { usePrograma } from "../../../hooks/usePrograma";
import type { ProgramaAcademico } from "../../../types/ProgramaAcademico";

const columns = [
  { id: "nombre", name: "Nombre" },
  { id: "codigo", name: "Código" },
  { id: "facultad", name: "Facultad" },
  { id: "jornada", name: "Jornada" },
  { id: "activo", name: "Estado" },
  { id: "acciones", name: "Acciones" },
];

interface TablaProgramasProps {
  onEdit: (programa: ProgramaAcademico) => void;
}

export const TablaProgramas = ({ onEdit }: TablaProgramasProps) => {
  const {
    programas,
    total,
    page,
    limit,
    isLoading,
    fetchProgramas,
    toggleStatus,
  } = usePrograma();

  useEffect(() => {
    fetchProgramas({ page, limit });
  }, [page, limit, fetchProgramas]);

  const handleToggleStatus = async (
    programa: ProgramaAcademico
  ) => {
    const isActivating = !programa.activo;

    const result = await Swal.fire({
      title: `¿${isActivating ? "Activar" : "Desactivar"} programa?`,
      text: `Estás a punto de ${
        isActivating ? "activar" : "desactivar"
      } "${programa.nombre}".`,
      icon: isActivating ? "success" : "warning",
      showCancelButton: true,
      confirmButtonColor: isActivating ? "#10b981" : "#f59e0b",
      cancelButtonColor: "#6b7280",
      confirmButtonText: `Sí, ${
        isActivating ? "activar" : "desactivar"
      }`,
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      await toggleStatus(programa.id);

      await Swal.fire(
        "¡Éxito!",
        `Programa ${
          isActivating ? "activado" : "desactivado"
        } correctamente.`,
        "success"
      );
    } catch {
      await Swal.fire(
        "Error",
        "No se pudo cambiar el estado.",
        "error"
      );
    }
  };

  const totalPages = Math.ceil(total / limit);

  const startResult =
    total === 0 ? 0 : (page - 1) * limit + 1;

  const endResult = Math.min(page * limit, total);

  return (
    <div className="space-y-4">
      <Table>
        <Table.ScrollContainer>
          <Table.Content
            aria-label="Tabla de programas académicos"
            className="min-w-[800px]"
          >
            <Table.Header columns={columns}>
              {(column) => (
                <Table.Column
                  key={column.id}
                  isRowHeader={column.id === "nombre"}
                >
                  {column.name}
                </Table.Column>
              )}
            </Table.Header>

            <Table.Body
              items={isLoading ? [] : programas}
              renderEmptyState={() => (
                <div className="py-8 text-center text-sm text-muted">
                  {isLoading
                    ? "Cargando programas..."
                    : "No hay programas académicos registrados."}
                </div>
              )}
            >
              {(programa) => (
                <Table.Row key={programa.id}>
                  <Table.Cell>
                    {programa.nombre}
                  </Table.Cell>

                  <Table.Cell>
                    <Chip
                      size="sm"
                      variant="soft"
                    >
                      {programa.codigo}
                    </Chip>
                  </Table.Cell>

                  <Table.Cell>
                    {programa.facultad || "N/A"}
                  </Table.Cell>

                  <Table.Cell>
                    {programa.jornada || "N/A"}
                  </Table.Cell>

                  <Table.Cell>
                    <Chip
                      color={
                        programa.activo
                          ? "success"
                          : "danger"
                      }
                      size="sm"
                      variant="soft"
                    >
                      {programa.activo
                        ? "Activo"
                        : "Inactivo"}
                    </Chip>
                  </Table.Cell>

                  <Table.Cell>
                    <div className="flex gap-2">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="outline"
                      
                        aria-label={`Editar ${programa.nombre}`}
                        onPress={() => onEdit(programa)}
                      >
                        <Edit size={16} />
                      </Button>

                      <Button
                        isIconOnly
                        size="sm"
                        variant="outline"
                       
                        aria-label={
                          programa.activo
                            ? `Desactivar ${programa.nombre}`
                            : `Activar ${programa.nombre}`
                        }
                        onPress={() =>
                          handleToggleStatus(programa)
                        }
                      >
                        <Power size={16} />
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>

        {totalPages > 0 && (
          <Table.Footer>
            <Pagination size="sm">
              <Pagination.Summary>
                {startResult} a {endResult} de {total} resultados
              </Pagination.Summary>

              <Pagination.Content>
                <Pagination.Item>
                  <Pagination.Previous
                    isDisabled={page === 1 || isLoading}
                    onPress={() =>
                      fetchProgramas({
                        page: Math.max(1, page - 1),
                        limit,
                      })
                    }
                  >
                    <Pagination.PreviousIcon />
                    Anterior
                  </Pagination.Previous>
                </Pagination.Item>

                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1
                ).map((pageNumber) => (
                  <Pagination.Item key={pageNumber}>
                    <Pagination.Link
                      isActive={pageNumber === page}
                      onPress={() =>
                        fetchProgramas({
                          page: pageNumber,
                          limit,
                        })
                      }
                    >
                      {pageNumber}
                    </Pagination.Link>
                  </Pagination.Item>
                ))}

                <Pagination.Item>
                  <Pagination.Next
                    isDisabled={
                      page === totalPages || isLoading
                    }
                    onPress={() =>
                      fetchProgramas({
                        page: Math.min(
                          totalPages,
                          page + 1
                        ),
                        limit,
                      })
                    }
                  >
                    Siguiente
                    <Pagination.NextIcon />
                  </Pagination.Next>
                </Pagination.Item>
              </Pagination.Content>
            </Pagination>
          </Table.Footer>
        )}
      </Table>
    </div>
  );
};