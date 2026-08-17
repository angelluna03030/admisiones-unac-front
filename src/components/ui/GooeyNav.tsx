import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";

export interface GooeyNavItem {
  label: string;
  href: string;
}

interface GooeyNavProps {
  items: GooeyNavItem[];
  /** Índice inicialmente activo */
  initialActiveIndex?: number;
  /** Clase para el contenedor raíz (permite posicionar en el header) */
  className?: string;
}

/**
 * GooeyNav
 * --------
 * Navegación con efecto "viscoso": una mancha dorada se estira entre el
 * item activo y el item bajo el cursor, y un filtro SVG (blur + contraste)
 * funde ambas manchas en una sola forma orgánica antes de que el mouse
 * suelte el nuevo destino.
 *
 * Técnica: dos capas superpuestas.
 *  1) Capa "goo" (con filtro SVG) que solo contiene las manchas — nunca texto,
 *     porque el filtro de contraste satura y desdibuja cualquier contenido.
 *  2) Capa de texto limpia, sin filtro, con los labels y el manejo de clicks.
 */
export default function GooeyNav({
  items,
  initialActiveIndex = 0,
  className = "",
}: GooeyNavProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [rects, setRects] = useState<Record<number, DOMRect>>({});

  const measure = useCallback(() => {
    if (!containerRef.current) return;
    const containerBox = containerRef.current.getBoundingClientRect();
    const next: Record<number, DOMRect> = {};
    itemRefs.current.forEach((el, i) => {
      if (!el) return;
      const box = el.getBoundingClientRect();
      next[i] = new DOMRect(
        box.left - containerBox.left,
        box.top - containerBox.top,
        box.width,
        box.height
      );
    });
    setRects(next);
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure, items.length]);

  const activeRect = rects[activeIndex];
  const hoverRect = hoverIndex !== null ? rects[hoverIndex] : null;

  const blobStyle = (rect?: DOMRect): CSSProperties =>
    rect
      ? {
          transform: `translate(${rect.x}px, ${rect.y}px)`,
          width: rect.width,
          height: rect.height,
        }
      : { opacity: 0 };

  return (
    <nav
      ref={containerRef}
      className={`relative isolate flex items-center gap-1 rounded-full bg-navy-950/40 p-1 backdrop-blur-sm ${className}`}
      aria-label="Navegación principal"
    >
      {/* Capa 1: manchas viscosas, con filtro SVG "goo" */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ filter: "url(#unac-goo)" }}
        aria-hidden="true"
      >
        {/* Mancha activa (siempre visible, dorada sólida) */}
        <div
          className="absolute rounded-full bg-gold-500 transition-[transform,width,height] duration-500 ease-[cubic-bezier(0.65,0,0.35,1)]"
          style={blobStyle(activeRect)}
        />
        {/* Mancha de hover: aparece y "chorrea" hacia el item bajo el cursor */}
        <div
          className="absolute rounded-full bg-gold-500/80 transition-[transform,width,height,opacity] duration-300 ease-out"
          style={{
            ...blobStyle(hoverRect ?? undefined),
            opacity: hoverRect ? 1 : 0,
          }}
        />
      </div>

      {/* Capa 2: texto limpio, clickeable, sin filtro */}
      {items.map((item, i) => {
        const isActive = i === activeIndex;
        return (
          <button
            key={item.href}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            type="button"
            onMouseEnter={() => setHoverIndex(i)}
            onMouseLeave={() => setHoverIndex(null)}
            onClick={() => {
              setActiveIndex(i);
              const target = document.querySelector(item.href);
              target?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            className={`relative z-10 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 ${
              isActive
                ? "text-navy-950"
                : "text-paper/80 hover:text-navy-950"
            }`}
          >
            {item.label}
          </button>
        );
      })}

      {/* Filtro SVG: blur + matriz de contraste alto = efecto "goo" */}
      <svg className="absolute h-0 w-0" aria-hidden="true">
        <defs>
          <filter id="unac-goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>
    </nav>
  );
}
