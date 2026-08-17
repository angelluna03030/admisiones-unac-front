import { useEffect, useRef, useState, type ReactNode } from "react";

export interface ScrollExpandItem {
  id: string;
  eyebrow: string;
  title: string;
  body: ReactNode;
}

interface ScrollExpandProps {
  items: ScrollExpandItem[];
  className?: string;
}

/**
 * ScrollExpand
 * ------------
 * Cada item nace "cerrado" (colapsado) y se expande — altura, escala y
 * opacidad reales, no solo un fade — en cuanto entra al viewport, usando
 * IntersectionObserver. Una línea vertical dorada conecta los hitos y
 * "se llena" hasta el último item visible, como una ruta que se recorre.
 *
 * Se usa tanto para el trayecto de admisión ("La Ruta") como para la
 * oferta académica, controlado por quien lo instancia.
 */
export default function ScrollExpand({ items, className = "" }: ScrollExpandProps) {
  const [visible, setVisible] = useState<Set<string>>(new Set());
  const refs = useRef<Record<string, HTMLLIElement | null>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        setVisible((prev) => {
          const next = new Set(prev);
          entries.forEach((entry) => {
            const id = entry.target.getAttribute("data-id");
            if (!id) return;
            if (entry.isIntersecting) next.add(id);
          });
          return next;
        });
      },
      { threshold: 0.35, rootMargin: "0px 0px -10% 0px" }
    );

    Object.values(refs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  const lastVisibleIndex = items.reduce(
    (acc, item, i) => (visible.has(item.id) ? i : acc),
    -1
  );

  return (
    <ol className={`relative ${className}`}>
      {/* Riel de fondo */}
      <div className="absolute left-[15px] top-2 bottom-2 w-px bg-navy-800/15 md:left-[19px]" />
      {/* Riel "recorrido" — crece según el último hito visible */}
      <div
        className="absolute left-[15px] top-2 w-px bg-gold-500 transition-[height] duration-700 ease-out md:left-[19px]"
        style={{
          height:
            lastVisibleIndex >= 0
              ? `${((lastVisibleIndex + 1) / items.length) * 100}%`
              : "0%",
        }}
      />

      {items.map((item, i) => {
        const isOpen = visible.has(item.id);
        return (
          <li
            key={item.id}
            data-id={item.id}
            ref={(el) => {
              refs.current[item.id] = el;
            }}
            className="relative mb-4 pl-10 last:mb-0 md:pl-14"
          >
            {/* Nodo del hito */}
            <span
              className={`absolute left-0 top-1 flex h-8 w-8 items-center justify-center rounded-full border-2 font-mono text-xs transition-colors duration-500 md:h-10 md:w-10 ${
                isOpen
                  ? "border-gold-500 bg-gold-500 text-navy-950"
                  : "border-navy-800/25 bg-paper text-navy-800/40"
              }`}
            >
              {String(i + 1).padStart(2, "0")}
            </span>

            {/* Contenido: colapsado -> expandido */}
            <div
              className={`origin-top overflow-hidden rounded-2xl border transition-[max-height,opacity,transform,padding] duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
                isOpen
                  ? "max-h-[640px] scale-100 border-navy-800/10 bg-white/70 px-5 py-5 opacity-100 shadow-sm"
                  : "max-h-0 scale-[0.98] border-transparent px-5 py-0 opacity-0"
              }`}
            >
              <p className="eyebrow text-gold-600">{item.eyebrow}</p>
              <h3 className="mt-1 font-display text-xl text-navy-900 md:text-2xl">
                {item.title}
              </h3>
              <div className="mt-2 text-sm leading-relaxed text-ink-soft md:text-base">
                {item.body}
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
