import { lazy, Suspense, useEffect, useState } from "react";
import Hero from "../components/Hero";
import Footer from "../components/Footer";

// Lo que está debajo del hero se descarga después del primer pintado:
// la galería (GSAP), el formulario y el chat (framer-motion) no frenan la carga inicial
const cargarProgramas = () => import("../components/programas").then((m) => ({ default: m.Programas }));
const cargarFormulario = () => import("../components/AdmissionForm");
const cargarVida = () => import("../components/vida").then((m) => ({ default: m.Vida }));
const cargarChat = () => import("../components/chat/ChatWidget").then((m) => ({ default: m.ChatWidget }));

const Programas = lazy(cargarProgramas);
const AdmissionForm = lazy(cargarFormulario);
const Vida = lazy(cargarVida);
const ChatWidget = lazy(cargarChat);

/** Reserva el alto de la sección (y su id para los enlaces del menú) mientras se descarga. */
const Reserva = ({ id, className }: { id: string; className: string }) => (
  <section id={id} aria-busy="true" className={className} />
);

const cuandoEsteLibre = (fn: () => void) => {
  if ("requestIdleCallback" in window) {
    const id = window.requestIdleCallback(fn, { timeout: 2500 });
    return () => window.cancelIdleCallback(id);
  }
  const id = setTimeout(fn, 1200);
  return () => clearTimeout(id);
};

export default function AdmissionsLanding() {
  const [mostrarChat, setMostrarChat] = useState(false);

  useEffect(
    () =>
      cuandoEsteLibre(() => {
        // Precarga las secciones para que al hacer scroll ya estén listas
        void cargarProgramas();
        void cargarFormulario();
        void cargarVida();
        setMostrarChat(true);
      }),
    [],
  );

  return (
    <main className="min-h-screen bg-paper font-body text-ink">
      <Hero />
      <Suspense fallback={<Reserva id="programas" className="min-h-[80vh] bg-navy-900" />}>
        <Programas />
      </Suspense>
      <Suspense fallback={<Reserva id="admisiones" className="min-h-screen bg-navy-900" />}>
        <AdmissionForm />
      </Suspense>
      <Suspense fallback={<Reserva id="vida" className="min-h-[80vh] bg-navy-900" />}>
        <Vida />
      </Suspense>
      <Footer />
      {mostrarChat && (
        <Suspense fallback={null}>
          <ChatWidget />
        </Suspense>
      )}
    </main>
  );
}
