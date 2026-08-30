import { useState, useEffect, type FormEvent } from "react";
import {
  Button,
  FieldError,
  Input,
  Label,
  ListBox,
  Modal,
  Select,
  TextField,
} from "@heroui/react";
import { usePrograma } from "../hooks/usePrograma"; 
import { aspiranteApi } from "../api/aspirante";   
import ScrollExpand, { type ScrollExpandItem } from "./ui/ScrollExpand";

const STEPS: ScrollExpandItem[] = [
  {
    id: "paso-1",
    eyebrow: "Paso 01",
    title: "Pre-inscripción en línea",
    body: "Completa el formulario con tus datos básicos y el programa de tu interés. Toma menos de 3 minutos.",
  },
  {
    id: "paso-2",
    eyebrow: "Paso 02",
    title: "Contacto con Admisiones",
    body: "Un asesor te escribe en menos de 48 horas para resolver dudas y enviarte el checklist de documentos.",
  },
  {
    id: "paso-3",
    eyebrow: "Paso 03",
    title: "Entrega de documentos y entrevista",
    body: "Cargas tus documentos y agendas una entrevista de admisión, presencial o virtual.",
  },
  {
    id: "paso-4",
    eyebrow: "Paso 04",
    title: "Matrícula",
    body: "Recibes tu carta de aceptación y formalizas tu matrícula financiera y académica.",
  },
];

interface FormState {
  nombres: string;
  apellidos: string;
  tipoDocumento: string;
  numeroDocumento: string;
  email: string;
  phone: string;
  programaId: string;
}

const INITIAL_STATE: FormState = {
  nombres: "",
  apellidos: "",
  tipoDocumento: "CC",
  numeroDocumento: "",
  email: "",
  phone: "",
  programaId: "",
};

export default function AdmissionForm() {
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { programas, fetchProgramas } = usePrograma();

  useEffect(() => {
  fetchProgramas({ page: 1, limit: 100 }); // o el límite que uses
}, []);
  const handleChange = (field: keyof FormState) => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        nombres: form.nombres,
        apellidos: form.apellidos,
        tipoDocumento: form.tipoDocumento,
        numeroDocumento: form.numeroDocumento,
        correo: form.email,
        telefono: form.phone,
        direccion: `Interesado en programa ID: ${form.programaId}`, 
        ciudad: "Pre-inscripción Web",
      };

      await aspiranteApi.create(payload);
      
      setIsModalOpen(true);
      setForm(INITIAL_STATE);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error al pre-inscribir:", error);
      alert(error.response?.data?.message || "Hubo un error al enviar la pre-inscripción. Intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ FILTRO: Solo mostramos programas que estén activos
const programasActivos = programas.filter((prog) => prog.activo !== false);
  return (
    <section id="admisiones" className="bg-navy-900 px-6 py-24 md:px-12">
      <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[1fr_1fr]">
        {/* Proceso paso a paso */}
        <div>
          <span className="eyebrow text-gold-300">Proceso de admisión</span>
          <h2 className="mt-2 font-display text-3xl text-paper md:text-4xl">
            Cuatro pasos entre tú y tu carné UNAC.
          </h2>
          <div className="mt-10 [&_.eyebrow]:text-gold-300 [&_h3]:text-paper [&_p]:text-paper/70 [&_.bg-white\/70]:bg-navy-800/60 [&_.border-navy-800\/10]:border-paper/10 [&_.border-navy-800\/25]:border-paper/20 [&_.text-navy-800\/40]:text-paper/40 [&_.bg-paper]:bg-navy-900">
            <ScrollExpand items={STEPS} />
          </div>
        </div>

        {/* Formulario de pre-inscripción */}
        <div className="rounded-3xl border border-paper/10 bg-navy-800/50 p-6 md:p-8">
          <span className="eyebrow text-gold-300">Pre-inscripción</span>
          <h3 className="mt-2 font-display text-2xl text-paper">Empieza tu proceso hoy</h3>
          <p className="mt-2 text-sm text-paper/60">Sin costo, sin compromiso. Un asesor te contactará muy pronto.</p>
<form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <TextField isRequired>
      <Label className="text-paper/70">Nombres</Label>
      <Input
        placeholder="Ej: María Fernanda"
        value={form.nombres}
        onChange={(e) => handleChange("nombres")(e.target.value)}
        variant="secondary"
        className="text-black"
      />
      <FieldError />
    </TextField>

    <TextField isRequired>
      <Label className="text-paper/70">Apellidos</Label>
      <Input
        placeholder="Ej: Rojas López"
        value={form.apellidos}
        onChange={(e) => handleChange("apellidos")(e.target.value)}
        variant="secondary"
        className="text-black"
      />
      <FieldError />
    </TextField>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <Select
      isRequired
      value={form.tipoDocumento || null}
      onChange={(value) => value && handleChange("tipoDocumento")(value as string)}
    >
      <Label className="text-paper/70">Tipo de Doc.</Label>
      <Select.Trigger className="text-black">
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover>
        <ListBox>
          <ListBox.Item id="CC" textValue="Cédula de Ciudadanía">
            Cédula de Ciudadanía
            <ListBox.ItemIndicator />
          </ListBox.Item>
          <ListBox.Item id="TI" textValue="Tarjeta de Identidad">
            Tarjeta de Identidad
            <ListBox.ItemIndicator />
          </ListBox.Item>
          <ListBox.Item id="CE" textValue="Cédula de Extranjería">
            Cédula de Extranjería
            <ListBox.ItemIndicator />
          </ListBox.Item>
          <ListBox.Item id="PAS" textValue="Pasaporte">
            Pasaporte
            <ListBox.ItemIndicator />
          </ListBox.Item>
        </ListBox>
      </Select.Popover>
    </Select>

    <TextField isRequired className="md:col-span-2">
      <Label className="text-paper/70">Número de Documento</Label>
      <Input
        placeholder="Ej: 1234567890"
        value={form.numeroDocumento}
        onChange={(e) => handleChange("numeroDocumento")(e.target.value)}
        variant="secondary"
        className="text-black"
      />
      <FieldError />
    </TextField>
  </div>

  <TextField isRequired>
    <Label className="text-paper/70">Correo Electrónico</Label>
    <Input
      type="email"
      placeholder="tucorreo@ejemplo.com"
      value={form.email}
      onChange={(e) => handleChange("email")(e.target.value)}
      variant="secondary"
      className="text-black"
    />
    <FieldError />
  </TextField>

  <TextField isRequired>
    <Label className="text-paper/70">Teléfono / WhatsApp</Label>
    <Input
      type="tel"
      placeholder="Ej: 300 123 4567"
      value={form.phone}
      onChange={(e) => handleChange("phone")(e.target.value)}
      variant="secondary"
      className="text-black"
    />
    <FieldError />
  </TextField>

  <Select
    isRequired
    value={form.programaId || null}
    onChange={(value) => value && handleChange("programaId")(value as string)}
  >
    <Label className="text-paper/70">Programa Académico de Interés</Label>
    <Select.Trigger className="text-black">
      <Select.Value />
      <Select.Indicator />
    </Select.Trigger>
    <Select.Popover>
      <ListBox>
        {programasActivos.map((prog) => (
          <ListBox.Item key={prog.id} id={prog.id} textValue={prog.nombre}>
            {prog.nombre}
            <ListBox.ItemIndicator />
          </ListBox.Item>
        ))}
      </ListBox>
    </Select.Popover>
  </Select>

  <Button
    type="submit"
    isDisabled={isSubmitting}
    className="mt-4 h-12 px-6 text-base bg-gold-500 font-medium text-navy-950 hover:bg-gold-400"
  >
    Enviar pre-inscripción
  </Button>
</form>
        </div>
      </div>

      {/* Modal de Confirmación */}
      <Modal isOpen={isModalOpen} onOpenChange={setIsModalOpen}  >
        <Modal.Backdrop>
          <Modal.Container>
            <Modal.Dialog>
              <Modal.CloseTrigger />
              <Modal.Header>
                <Modal.Heading className="text-foreground">¡Pre-inscripción Recibida!</Modal.Heading>
              </Modal.Header>
              <Modal.Body>
                <p className="text-sm text-default-600">
                  Gracias{form.nombres ? `, ${form.nombres}` : ""}. Un asesor de Admisiones UNAC se pondrá en contacto contigo muy pronto{form.email ? ` al correo ${form.email}` : ""}.
                </p>
              </Modal.Body>
              <Modal.Footer>
                <Button
              
                  className="bg-gold-500 text-navy-950 hover:bg-gold-400"
                  onPress={() => setIsModalOpen(false)}
                >
                  Entendido
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </section>
  );
}