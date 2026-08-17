import { Button } from "@heroui/react";

const COLUMNS: { title: string; links: string[] }[] = [
  {
    title: "Facultades",
    links: ["Ingeniería", "Ciencias de la Salud", "Teología", "Educación"],
  },
  {
    title: "Programas",
    links: ["Proceso paso a paso", "Becas y financiación", "Calendario académico", "Preguntas frecuentes"],
  },
  {
    title: "Admisiones",
    links: ["Proceso paso a paso", "Becas y financiación", "Calendario académico", "Preguntas frecuentes"],
  },
  {
    title: "Vida UNAC",
    links: ["Campus", "Capellanía", "Deportes", "Grupos musicales"],
  },
];

export default function Footer() {
  return (
    <footer id="contacto" className="bg-navy-950 px-6 pb-8 pt-20 md:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-500 font-display text-sm font-bold text-navy-950">
                U
              </span>
              <span className="font-display text-lg text-paper">UNAC</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-paper/60">
              Universidad Adventista de Colombia. Formación integral: mente,
              cuerpo y espíritu, al servicio de tu vocación.
            </p>
            <Button
              as="a"
              href="#admisiones"
              radius="full"
              size="sm"
              className="mt-5 bg-gold-500 font-medium text-navy-950 hover:bg-gold-400"
            >
              Inicia tu admisión
            </Button>
          </div>     

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="eyebrow text-gold-300/70">{col.title}</h4>
              <ul className="mt-4 flex flex-col gap-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#programas"
                      className="text-sm text-paper/60 transition-colors hover:text-gold-300 cursor-pointer"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

    
        <div className="flex flex-col items-start justify-between gap-4 text-xs text-paper/40 md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} Universidad Adventista de Colombia (UNAC). Todos los derechos reservados.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gold-300">Términos</a>
            <a href="#" className="hover:text-gold-300">Privacidad</a>
            <a href="mailto:admisiones@unac.edu.co" className="hover:text-gold-300">
              admisiones@unac.edu.co
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
