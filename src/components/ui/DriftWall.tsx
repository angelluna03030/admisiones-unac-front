import { useEffect, useMemo, useRef, useState } from "react";

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
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

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

    const handleMove = (e: MouseEvent) => {
      const box = el.getBoundingClientRect();
      const x = (e.clientX - box.left) / box.width - 0.5; // -0.5 a 0.5
      const y = (e.clientY - box.top) / box.height - 0.5;
      setPointer({ x, y });
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <div
      ref={wrapperRef}
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
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
          const parallaxX = pointer.x * 24 * cfg.depth;
          const parallaxY = pointer.y * 24 * cfg.depth;

          return (
            // Capa externa: solo parallax (sigue al mouse).
            // Capa interna: solo deriva por keyframes.
            // Separadas para que ambos "transform" no se pisen entre sí.
            <div
              key={`${tile.label}-${i}`}
              style={{
                transform: `translate(${parallaxX}px, ${parallaxY}px)`,
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
      `}</style>
    </div>
  );
}
