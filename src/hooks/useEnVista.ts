import { useEffect, useState, type RefObject } from 'react';

/**
 * Llama a `onChange(true)` cuando el elemento está en pantalla y la pestaña
 * está activa, y `onChange(false)` en caso contrario. Sirve para pausar
 * animaciones costosas que nadie está viendo.
 */
export const observarVisibilidad = (
  element: Element,
  onChange: (visible: boolean) => void,
  rootMargin = '100px',
) => {
  let enPantalla = false;
  const notificar = () => onChange(enPantalla && !document.hidden);

  const observer = new IntersectionObserver(
    ([entry]) => {
      enPantalla = entry.isIntersecting;
      notificar();
    },
    { rootMargin },
  );
  observer.observe(element);
  document.addEventListener('visibilitychange', notificar);

  return () => {
    observer.disconnect();
    document.removeEventListener('visibilitychange', notificar);
  };
};

/** Versión en hook: `true` mientras el elemento se ve y la pestaña está activa. */
export const useEnVista = (ref: RefObject<Element | null>, rootMargin = '100px') => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    return observarVisibilidad(ref.current, setVisible, rootMargin);
  }, [ref, rootMargin]);

  return visible;
};
