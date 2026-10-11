"use client";

import { useEffect } from "react";
import { Edit } from "lucide-react";
import {
  Button,
  Chip,
  Pagination,
  Table,
} from "@heroui/react";
import { useAspirante } from "../../../hooks/useAspirante";
import type { Aspirante } from "../../../types/Aspirante";

const columns = [
  { id: "documento", name: "Documento" },
  { id: "nombre", name: "Nombre Completo" },
  { id: "correo", name: "Correo" },
  { id: "telefono", name: "Teléfono" },
  { id: "ciudad", name: "Ciudad" },
  { id: "acciones", name: "Acciones" },
];

interface TablaAspirantesProps {
  onEdit: (aspirante: Aspirante) => void;
}

export const TablaAspirantes = ({ onEdit }: TablaAspirantesProps) => {
  const {
    aspirantes,
    total,
    page,
    limit,
    fetchAspirantes,
  } = useAspirante();

  useEffect(() => {
    fetchAspirantes({ page, limit });
  }, [page, limit, fetchAspirantes]);

  const totalPages = Math.ceil(total / limit);

  const startResult =
    total === 0 ? 0 : (page - 1) * limit + 1;

  const endResult = Math.min(page * limit, total);

  return (
    <div className="space-y-4">
      <Table>
        <Table.ScrollContainer>
          <Table.Content
            aria-label="Tabla de aspirantes"
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
              items={aspirantes}
              renderEmptyState={() => (
                <div className="py-8 text-center text-sm text-muted">
                  No hay aspirantes registrados.
                </div>
              )}
            >
              {(aspirante) => (
                <Table.Row key={aspirante.id}>
                  {/* Documento */}
                  <Table.Cell>
                    <div className="flex items-center gap-2">
                      <Chip
                        size="sm"
                        variant="soft"
                      >
                        {aspirante.tipoDocumento}
                      </Chip>

                      <span className="font-medium">
                        {aspirante.numeroDocumento}
                      </span>
                    </div>
                  </Table.Cell>

                  {/* Nombre */}
                  <Table.Cell>
                    {aspirante.nombres}{" "}
                    {aspirante.apellidos}
                  </Table.Cell>

                  {/* Correo */}
                  <Table.Cell>
                    {aspirante.correo}
                  </Table.Cell>

                  {/* Teléfono */}
                  <Table.Cell>
                    {aspirante.telefono || "N/A"}
                  </Table.Cell>

                  {/* Ciudad */}
                  <Table.Cell>
                    {aspirante.ciudad || "N/A"}
                  </Table.Cell>

                  {/* Acciones */}
                  <Table.Cell>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="secondary"
                      aria-label={`Editar ${aspirante.nombres} ${aspirante.apellidos}`}
                      onPress={() => onEdit(aspirante)}
                    >
                      <Edit size={16} />
                    </Button>
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
                    isDisabled={page === 1}
                    onPress={() => {
                      void fetchAspirantes({
                        page: Math.max(1, page - 1),
                        limit,
                      });
                    }}
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
                      onPress={() => {
                        void fetchAspirantes({
                          page: pageNumber,
                          limit,
                        });
                      }}
                    >
                      {pageNumber}
                    </Pagination.Link>
                  </Pagination.Item>
                ))}

                <Pagination.Item>
                  <Pagination.Next
                    isDisabled={page === totalPages}
                    onPress={() => {
                      void fetchAspirantes({
                        page: Math.min(
                          totalPages,
                          page + 1
                        ),
                        limit,
                      });
                    }}
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