import { useState, type FormEvent } from "react";
import {
  Button,
  Input,
  Label,
  ListBox,
  Modal,

  Select,


} from "@heroui/react";

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

const PROGRAMS = [
  { key: "ing-sistemas", label: "Ingeniería de Sistemas" },
  { key: "ing-industrial", label: "Ingeniería Industrial" },
  { key: "enfermeria", label: "Enfermería" },
  { key: "nutricion", label: "Nutrición y Dietética" },
  { key: "teologia", label: "Teología" },
  { key: "ministerio-pastoral", label: "Ministerio Pastoral" },
  {
    key: "edu-infantil",
    label: "Licenciatura en Educación Infantil",
  },
  {
    key: "edu-teologica",
    label: "Licenciatura en Teología y Educación Cristiana",
  },
];

interface FormState {
  fullName: string;
  email: string;
  phone: string;
  program: string;
}

const INITIAL_STATE: FormState = {
  fullName: "",
  email: "",
  phone: "",
  program: "",
};

export default function AdmissionForm() {


  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [submitted, setSubmitted] = useState<FormState | null>(null);

  const handleChange = (field: keyof FormState) => (value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSubmitted(form);
    setForm(INITIAL_STATE);

    // Abre el Modal después de enviar correctamente
  };

  return (
    <section id="admisiones" className="bg-navy-900 px-6 py-24 md:px-12">
      <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[1fr_1fr]">
        {/* Proceso paso a paso */}
        <div>
          <span className="eyebrow text-gold-300">Proceso de admisión</span>

          <h2 className="mt-2 font-display text-3xl text-paper md:text-4xl">
            Cuatro pasos entre tú y tu carné UNAC.
          </h2>

          <div
            className="
              mt-10
              [&_.eyebrow]:text-gold-300
              [&_h3]:text-paper
              [&_p]:text-paper/70
              [&_.bg-white\\/70]:bg-navy-800/60
              [&_.border-navy-800\\/10]:border-paper/10
              [&_.border-navy-800\\/25]:border-paper/20
              [&_.text-navy-800\\/40]:text-paper/40
              [&_.bg-paper]:bg-navy-900
            "
          >
            <ScrollExpand items={STEPS} />
          </div>
        </div>

        {/* Formulario */}
        <div className="rounded-3xl border border-paper/10 bg-navy-800/50 p-6 md:p-8">
          <span className="eyebrow text-gold-300">Pre-inscripción</span>

          <h3 className="mt-2 font-display text-2xl text-paper">
            Empieza tu proceso hoy
          </h3>

          <p className="mt-2 text-sm text-paper/60">
            Sin costo, sin compromiso. Un asesor te contactará muy pronto.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <Input
              placeholder="Ej: María Fernanda Rojas"
              value={form.fullName}
              onChange={(e) => handleChange("fullName")(e.target.value)}
              variant="secondary"
            
            />

            <Input
              type="email"
              placeholder="tucorreo@ejemplo.com"
              value={form.email}
              onChange={(e) => handleChange("email")(e.target.value)}
              variant="secondary"
          
            />

            <Input
              type="tel"
              placeholder="Ej: 300 123 4567"
              value={form.phone}
              onChange={(e) => handleChange("phone")(e.target.value)}
              variant="secondary"
            />

            <Select
              className="w-full"
              isRequired
              placeholder="Selecciona un programa"
              value={form.program}
              onChange={(value) => handleChange("program")(value as string)}
            >
              <Label className="text-paper/70">Programa académico</Label>

              <Select.Trigger className="border-paper/20 hover:border-gold-400">
                <Select.Value className="text-paper" />
                <Select.Indicator />
              </Select.Trigger>

              <Select.Popover>
                <ListBox>
                  {PROGRAMS.map((program) => (
                    <ListBox.Item
                      key={program.key}
                      id={program.key}
                      textValue={program.label}
                    >
                      {program.label}

                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  ))}
                </ListBox>
              </Select.Popover>
            </Select>
            <Modal>
              <Button
                type="submit"
                size="lg"
                className="
                mt-2
                bg-gold-500
                font-medium
                text-navy-950
                hover:bg-gold-400
              "
              >
                Enviar pre-inscripción
              </Button>
              <Modal.Backdrop>
                <Modal.Container>
                  <Modal.Dialog className="sm:max-w-[360px]">
                    <Modal.CloseTrigger />
                    <Modal.Header>
                      <Modal.Heading>
                        {" "}
                        ¡Recibimos tu pre-inscripción!
                      </Modal.Heading>
                    </Modal.Header>
                    <Modal.Body>
                      <p className="text-sm text-ink-soft">
                        Gracias
                        {submitted?.fullName ? `, ${submitted.fullName}` : ""}.
                        Un asesor de Admisiones UNAC se pondrá en contacto
                        contigo muy pronto
                        {submitted?.email
                          ? ` al correo ${submitted.email}`
                          : ""}
                        .
                      </p>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button
                        className="
                    bg-gold-500
                    font-medium
                    text-navy-950
                    hover:bg-gold-400
                  "
                  slot="close"
                      >
                        Entendido
                      </Button>
                    </Modal.Footer>
                  </Modal.Dialog>
                </Modal.Container>
              </Modal.Backdrop>
            </Modal>
          </form>
        </div>
      </div>
    </section>
  );
}
