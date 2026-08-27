/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import {
  Button,
  Input,
  Label,
  Modal,
} from "@heroui/react";
import { useAspirante } from "../../../hooks/useAspirante";

interface AspiranteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AspiranteModal = ({
  isOpen,
  onClose,
}: AspiranteModalProps) => {
  const {
    selectedAspirante,
    setSelectedAspirante,
    createAspirante,
    updateAspirante,
  } = useAspirante();

  const isEditing = !!selectedAspirante;

  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    tipoDocumento: "CC",
    numeroDocumento: "",
    correo: "",
    telefono: "",
    fechaNacimiento: "",
    direccion: "",
    ciudad: "",
  });

  useEffect(() => {
    if (isEditing && selectedAspirante) {
      setFormData({
        nombres: selectedAspirante.nombres,
        apellidos: selectedAspirante.apellidos,
        tipoDocumento: selectedAspirante.tipoDocumento,
        numeroDocumento: selectedAspirante.numeroDocumento,
        correo: selectedAspirante.correo,
        telefono: selectedAspirante.telefono || "",
        fechaNacimiento: selectedAspirante.fechaNacimiento
          ? new Date(
              selectedAspirante.fechaNacimiento
            )
              .toISOString()
              .split("T")[0]
          : "",
        direccion: selectedAspirante.direccion || "",
        ciudad: selectedAspirante.ciudad || "",
      });
    } else {
      setFormData({
        nombres: "",
        apellidos: "",
        tipoDocumento: "CC",
        numeroDocumento: "",
        correo: "",
        telefono: "",
        fechaNacimiento: "",
        direccion: "",
        ciudad: "",
      });
    }
  }, [isEditing, selectedAspirante, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEditing && selectedAspirante) {
        await updateAspirante(
          selectedAspirante.id,
          formData
        );
      } else {
        await createAspirante(formData);
      }

      onClose();

      // Limpia el aspirante seleccionado después de guardar
      setSelectedAspirante(null);
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog className="w-full sm:max-w-[700px]">
            <Modal.CloseTrigger />

            <form onSubmit={handleSubmit}>
              <Modal.Header>
                <Modal.Heading>
                  {isEditing
                    ? "Editar Aspirante"
                    : "Nuevo Aspirante"}
                </Modal.Heading>
              </Modal.Header>

              <Modal.Body>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {/* Nombres */}
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="aspirante-nombres">
                      Nombres
                    </Label>

                    <Input
                      id="aspirante-nombres"
                      placeholder="Ej: Juan Carlos"
                      value={formData.nombres}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          nombres: e.target.value,
                        })
                      }
                      
                    />
                  </div>

                  {/* Apellidos */}
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="aspirante-apellidos">
                      Apellidos
                    </Label>

                    <Input
                      id="aspirante-apellidos"
                      placeholder="Ej: García López"
                      value={formData.apellidos}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          apellidos: e.target.value,
                        })
                      }
                      
                    />
                  </div>

                  {/* Tipo de documento */}
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="aspirante-tipo-documento">
                      Tipo de Documento
                    </Label>

                    <Input
                      id="aspirante-tipo-documento"
                      placeholder="Ej: CC"
                      value={formData.tipoDocumento}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          tipoDocumento: e.target.value,
                        })
                      }
                      
                    />
                  </div>

                  {/* Número de documento */}
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="aspirante-numero-documento">
                      Número de Documento
                    </Label>

                    <Input
                      id="aspirante-numero-documento"
                      placeholder="Ej: 1234567890"
                      value={formData.numeroDocumento}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          numeroDocumento: e.target.value,
                        })
                      }
                      
                      disabled={isEditing}
                    />
                  </div>

                  {/* Correo */}
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="aspirante-correo">
                      Correo Electrónico
                    </Label>

                    <Input
                      id="aspirante-correo"
                      type="email"
                      placeholder="Ej: usuario@correo.com"
                      value={formData.correo}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          correo: e.target.value,
                        })
                      }
                      
                    />
                  </div>

                  {/* Teléfono */}
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="aspirante-telefono">
                      Teléfono
                    </Label>

                    <Input
                      id="aspirante-telefono"
                      type="tel"
                      placeholder="Ej: 3001234567"
                      value={formData.telefono}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          telefono: e.target.value,
                        })
                      }
                    />
                  </div>

                  {/* Fecha de nacimiento */}
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="aspirante-fecha-nacimiento">
                      Fecha de Nacimiento
                    </Label>

                    <Input
                      id="aspirante-fecha-nacimiento"
                      type="date"
                      value={formData.fechaNacimiento}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          fechaNacimiento: e.target.value,
                        })
                      }
                    />
                  </div>

                  {/* Ciudad */}
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="aspirante-ciudad">
                      Ciudad
                    </Label>

                    <Input
                      id="aspirante-ciudad"
                      placeholder="Ej: Medellín"
                      value={formData.ciudad}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          ciudad: e.target.value,
                        })
                      }
                    />
                  </div>

                  {/* Dirección */}
                  <div className="flex flex-col gap-1 md:col-span-2">
                    <Label htmlFor="aspirante-direccion">
                      Dirección
                    </Label>

                    <Input
                      id="aspirante-direccion"
                      placeholder="Ej: Calle 10 # 20-30"
                      value={formData.direccion}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          direccion: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </Modal.Body>

              <Modal.Footer>
                <Button
                  type="button"
                  variant="secondary"
                  onPress={onClose}
                >
                  Cancelar
                </Button>

                <Button type="submit">
                  {isEditing
                    ? "Guardar Cambios"
                    : "Crear Aspirante"}
                </Button>
              </Modal.Footer>
            </form>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};