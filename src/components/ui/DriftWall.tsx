import { useEffect, useMemo, useRef } from "react";
import { useEnVista } from "../../hooks/useEnVista";

export interface DriftTile {
  label: string;
  sublabel?: string;
}

interface DriftWallProps {
  tiles: DriftTile[];
  /** Número de columnas del muro */
  columns?: number;
  className?: string;
}

/**
 * DriftWall
 * ---------
 * Cuadrícula de tarjetas translúcidas que flotan lentamente (drift) en
 * ciclos independientes de duración/retardo, y reaccionan al mouse con un
 * parallax sutil por capas. Pensado como fondo atmosférico detrás del
 * contenido del Hero (no interactivo por click, solo por movimiento).
 */
export default function DriftWall({
  tiles,
  columns = 6,
  className = "",
}: DriftWallProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  // Las animaciones se pausan cuando el hero no se ve o la pestaña está en segundo plano
  const visible = useEnVista(wrapperRef);

  // Cada tile obtiene parámetros de deriva pseudoaleatorios pero estables
  const driftConfig = useMemo(
    () =>
      tiles.map((_, i) => {
        const seed = (i * 137) % 100;
        return {
          duration: 10 + (seed % 8), // 10s–17s
          delay: -(seed % 6), // negativo = arranca a mitad de ciclo
          depth: 0.3 + ((seed % 5) / 10), // 0.3–0.7 → intensidad del parallax
          driftX: 8 + (seed % 10), // px de recorrido horizontal
          driftY: 6 + ((seed * 3) % 12), // px de recorrido vertical
        };
      }),
    [tiles]
  );

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    // El parallax se escribe en variables CSS (sin re-render de React) y como máximo una vez por frame
    let frame: number | null = null;
    const handleMove = (e: MouseEvent) => {
      if (frame !== null) return;
      frame = requestAnimationFrame(() => {
        frame = null;
        const box = el.getBoundingClientRect();
        if (box.bottom < 0) return; // el hero ya no se ve
        el.style.setProperty("--pointer-x", String((e.clientX - box.left) / box.width - 0.5)); // -0.5 a 0.5
        el.style.setProperty("--pointer-y", String((e.clientY - box.top) / box.height - 0.5));
      });
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMove);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      data-paused={!visible}
      aria-hidden="true"
    >
      <div
        className="grid h-full w-full gap-3 p-4 opacity-[0.16]"
        style={{
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        }}
      >
        {tiles.map((tile, i) => {
          const cfg = driftConfig[i];
          const intensidad = 24 * cfg.depth;

          return (
            // Capa externa: solo parallax (sigue al mouse).
            // Capa interna: solo deriva por keyframes.
            // Separadas para que ambos "transform" no se pisen entre sí.
            <div
              key={`${tile.label}-${i}`}
              style={{
                transform: `translate(calc(var(--pointer-x, 0) * ${intensidad}px), calc(var(--pointer-y, 0) * ${intensidad}px))`,
                transition: "transform 700ms ease-out",
              }}
            >
              <div
                className="drift-tile flex aspect-square flex-col justify-end rounded-2xl border border-gold-300/25 bg-gradient-to-br from-navy-700/60 to-navy-900/60 p-3"
                style={
                  {
                    "--drift-x": `${cfg.driftX}px`,
                    "--drift-y": `${cfg.driftY}px`,
                    animationDuration: `${cfg.duration}s`,
                    animationDelay: `${cfg.delay}s`,
                  } as React.CSSProperties
                }
              >
                <span className="eyebrow text-gold-300/70">{tile.sublabel}</span>
                <span className="font-display text-sm text-paper/80">
                  {tile.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes unac-drift {
          0%   { transform: translate(0, 0); }
          25%  { transform: translate(var(--drift-x), calc(var(--drift-y) * -1)); }
          50%  { transform: translate(calc(var(--drift-x) * -0.6), var(--drift-y)); }
          75%  { transform: translate(calc(var(--drift-x) * 0.8), calc(var(--drift-y) * 0.4)); }
          100% { transform: translate(0, 0); }
        }
        .drift-tile {
          animation-name: unac-drift;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }
        [data-paused="true"] .drift-tile {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
