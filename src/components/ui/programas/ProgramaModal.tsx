"use client";

import { useEffect, useState } from "react";
import type { Key } from "@heroui/react";
import {
  Button,
  Input,
  Label,
  ListBox,
  Modal,
  Select,
  toast,
} from "@heroui/react";
import { usePrograma } from "../../../hooks/usePrograma";

interface ProgramaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const JORNADAS = [
  { id: "Diurna", name: "Diurna" },
  { id: "Nocturna", name: "Nocturna" },
  { id: "Virtual", name: "Virtual" },
  { id: "Fin de semana", name: "Fin de semana" },
];

export const ProgramaModal = ({
  isOpen,
  onClose,
}: ProgramaModalProps) => {
  const {
    selectedPrograma,
    createPrograma,
    updatePrograma,
  } = usePrograma();

  const isEditing = !!selectedPrograma;

  const [formData, setFormData] = useState({
    nombre: "",
    codigo: "",
    facultad: "",
    jornada: "",
  });

  useEffect(() => {
    if (isEditing && selectedPrograma) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        nombre: selectedPrograma.nombre,
        codigo: selectedPrograma.codigo,
        facultad: selectedPrograma.facultad || "",
        jornada: selectedPrograma.jornada || "",
      });
    } else {
      setFormData({
        nombre: "",
        codigo: "",
        facultad: "",
        jornada: "",
      });
    }
  }, [isEditing, selectedPrograma, isOpen]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre.trim() || !formData.codigo.trim()) {
      toast.danger("Datos incompletos", { description: "El nombre y el código son obligatorios." });
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditing && selectedPrograma) {
        await updatePrograma(selectedPrograma.id, formData);
        toast.success("Programa actualizado", { description: "Los cambios se guardaron correctamente." });
      } else {
        await createPrograma(formData);
        toast.success("Programa creado", { description: "El programa quedó registrado." });
      }

      onClose();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.danger("Error", { description: error?.response?.data?.message || "No se pudo guardar el programa." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedJornada = JORNADAS.find(
    (jornada) => jornada.id === formData.jornada
  );

  return (
    <Modal>
      <Modal.Backdrop isOpen={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
        <Modal.Container>
          <Modal.Dialog className="w-full sm:max-w-[500px]">
            <Modal.CloseTrigger />

            <form onSubmit={handleSubmit}>
              <Modal.Header>
                <Modal.Heading>
                  {isEditing
                    ? "Editar Programa"
                    : "Nuevo Programa Académico"}
                </Modal.Heading>
              </Modal.Header>

              <Modal.Body>
                <div className="flex flex-col gap-4">
                  {/* Nombre */}
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="programa-nombre">
                      Nombre o Razón Social
                    </Label>

                    <Input
                      id="programa-nombre"
                      placeholder="Ej: Ingeniería de Sistemas"
                      value={formData.nombre}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          nombre: e.target.value,
                        })
                      }
                      
                    />
                  </div>

                  {/* Código */}
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="programa-codigo">
                      Código
                    </Label>

                    <Input
                      id="programa-codigo"
                      placeholder="Ej: ING-SIS-01"
                      value={formData.codigo}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          codigo: e.target.value,
                        })
                      }
                      
                      disabled={isEditing}
                    />
                  </div>

                  {/* Facultad */}
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="programa-facultad">
                      Facultad
                    </Label>

                    <Input
                      id="programa-facultad"
                      placeholder="Ej: Facultad de Ingenierías"
                      value={formData.facultad}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          facultad: e.target.value,
                        })
                      }
                    />
                  </div>

                  {/* Jornada */}
                  <div className="flex flex-col gap-1">
                    <Select
                      className="w-full"
                      placeholder="Selecciona una jornada"
                      value={
                        (formData.jornada as Key) || null
                      }
                      onChange={(value) =>
                        setFormData({
                          ...formData,
                          jornada: value?.toString() || "",
                        })
                      }
                    >
                      <Label>Jornada</Label>

                      <Select.Trigger>
                        <Select.Value>
                          {selectedJornada?.name}
                        </Select.Value>

                        <Select.Indicator />
                      </Select.Trigger>

                      <Select.Popover>
                        <ListBox>
                          {JORNADAS.map((jornada) => (
                            <ListBox.Item
                              key={jornada.id}
                              id={jornada.id}
                              textValue={jornada.name}
                            >
                              {jornada.name}

                              <ListBox.ItemIndicator />
                            </ListBox.Item>
                          ))}
                        </ListBox>
                      </Select.Popover>
                    </Select>
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

                <Button type="submit" isPending={isSubmitting}>
                  {isEditing
                    ? "Guardar Cambios"
                    : "Crear Programa"}
                </Button>
              </Modal.Footer>
            </form>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};