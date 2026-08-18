import { Button } from "@heroui/react";
import GooeyNav from "./ui/GooeyNav";
import DriftWall, { type DriftTile } from "./ui/DriftWall";
import ParticleText from "./ui/ParticleText";

const NAV_ITEMS = [
  { label: "Inicio", href: "#inicio" },
  { label: "Programas", href: "#programas" },
  { label: "Admisiones", href: "#admisiones" },
  { label: "Vida UNAC", href: "#vida" },
  { label: "Contacto", href: "#contacto" },
];

const DRIFT_TILES: DriftTile[] = [
  { label: "Ingeniería", sublabel: "Facultad" },
  { label: "Teología", sublabel: "Facultad" },
  { label: "Ciencias de la Salud", sublabel: "Facultad" },
  { label: "Educación", sublabel: "Facultad" },
  { label: "Cohorte 2026-I", sublabel: "Admisión" },
  { label: "Becas del 20% al 100%", sublabel: "Financiación" },
  { label: "Campus Medellín", sublabel: "Sede" },
  { label: "+40 años formando", sublabel: "Trayectoria" },
  { label: "Residencias estudiantiles", sublabel: "Vida UNAC" },
  { label: "Práctica desde 3er semestre", sublabel: "Formación" },
  { label: "Grupos musicales", sublabel: "Vida UNAC" },
  { label: "Voluntariado misionero", sublabel: "Comunidad" },
  { label: "Laboratorios clínicos", sublabel: "Infraestructura" },
  { label: "Bolsa de empleo UNAC", sublabel: "Egresados" },
  { label: "Capellanía", sublabel: "Vida UNAC" },
  { label: "Deporte y recreación", sublabel: "Vida UNAC" },
  { label: "Intercambios", sublabel: "Internacional" },
  { label: "Semilleros de investigación", sublabel: "Academia" },
];

export default function Hero() {
  const scrollToAdmissions = () => {
    document.getElementById("admisiones")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <section
      id="inicio"
      className="relative flex min-h-screen flex-col overflow-hidden bg-navy-950"
    >
      {/* Fondo */}
      <DriftWall tiles={DRIFT_TILES} columns={6} />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-navy-950/40 via-navy-950/70 to-navy-950" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12">
        {/* Logo */}
        <a
          href="#inicio"
          className="flex items-center gap-2"
          aria-label="Universidad Adventista de Colombia"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-500 font-display text-sm font-bold text-navy-950">
            U
          </span>

          <span className="font-display text-lg tracking-tight text-paper">
            UNAC
          </span>
        </a>

        {/* Navegación */}
        <GooeyNav items={NAV_ITEMS} className="hidden md:flex" />

        {/* CTA */}
        <Button
          size="md"
          className="bg-gold-500 font-medium text-navy-950 hover:bg-gold-400"
          onPress={scrollToAdmissions}
        >
          Inscríbete
        </Button>
      </header>

      {/* Contenido principal */}
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-6 py-16 md:px-12">
        {/* Badge */}
        <span className="eyebrow w-fit rounded-full border border-gold-400/40 px-3 py-1 text-gold-300">
          Admisiones 2026-I abiertas
        </span>

        {/* Título */}
        <div className="mt-8 w-full max-w-6xl">
          <div className="w-full overflow-visible">
            <ParticleText
              text="Tu vocación no cabe"
              particleSize={2.2}
              density={4}
              color="#f8fafc"
              highlightColor="#d4a62a"
              scatter={190}
              gatherDuration={1600}
              stagger={420}
              pointerRepel={42}
              repelRadius={120}
              idleDrift={0.8}
              trigger="mount"
              fontSize="clamp(1.5rem, 11vw, 6rem)"
              fontWeight={800}
              fontFamily="inherit"
              glow
            />
          </div>

          <div className="mt-[-10px] w-full overflow-visible md:mt-[-20px]">
            <ParticleText
              text="en un salón cualquiera."
              particleSize={2.2}
              density={4}
              color="#f8fafc"
              highlightColor="#d4a62a"
              scatter={190}
              gatherDuration={1600}
              stagger={420}
              pointerRepel={42}
              repelRadius={120}
              idleDrift={0.8}
              trigger="mount"
              fontSize="clamp(1.5rem, 11vw, 6rem)"
              fontWeight={800}
              fontFamily="inherit"
              glow
            />
          </div>
        </div>

        {/* Descripción */}
        <p className="mt-10 max-w-xl text-base leading-relaxed text-paper/70 md:text-lg">
          En la Universidad Adventista de Colombia formamos profesionales con
          carácter, ciencia y propósito. Elige entre Ingeniería, Ciencias de la
          Salud, Teología y Educación, y empieza tu ruta de admisión hoy mismo.
        </p>

        {/* Botones */}
        <div className="mt-9 flex flex-wrap items-center gap-4">
          <Button
            size="lg"
            className="bg-gold-500 px-8 font-medium text-navy-950 hover:bg-gold-400"
            onPress={scrollToAdmissions}
          >
            Comenzar mi admisión
          </Button>

          <a
            href="#programas"
            className="border-paper/30 px-8 font-medium text-paper hover:border-gold-400 hover:text-gold-300 border rounded-lg inline-flex items-center justify-center h-12"
          >
            Ver programas académicos
          </a>
        </div>

        {/* Estadísticas */}
        <dl className="mt-14 grid w-full max-w-2xl grid-cols-3 gap-6 border-t border-paper/10 pt-6">
          <div>
            <dt className="eyebrow text-gold-300/70">Facultades</dt>

            <dd className="mt-1 font-display text-2xl text-paper">4</dd>
          </div>

          <div>
            <dt className="eyebrow text-gold-300/70">Egresados vinculados</dt>

            <dd className="mt-1 font-display text-2xl text-paper">92%</dd>
          </div>

          <div>
            <dt className="eyebrow text-gold-300/70">Becas disponibles</dt>

            <dd className="mt-1 font-display text-2xl text-paper">20–100%</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
