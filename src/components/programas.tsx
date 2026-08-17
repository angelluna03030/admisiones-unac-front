import AccordionGallery from "./ui/AccordionGallery";

const items = [
  {
    image: "https://www.unac.edu.co/wp-content/uploads/2024/06/Enfermeria-hero-fixed-1536x570.webp",
    label: "ENFERMERÍA",
    link: "#",
  },
  {
    image: "https://www.unac.edu.co/wp-content/uploads/2024/10/Ingenieria-industrial-UNAC-miniatura.webp",
    label: "INGENIERÍA INDUSTRIAL",
    link: "#",
  },
  {
    image: "https://www.unac.edu.co/wp-content/uploads/2024/10/Ingenieria-de-Sistemas-miniatura-unac.webp",
    label: "INGENIERÍA DE SISTEMAS",
    link: "#",
  },
  {
    image: "https://www.unac.edu.co/wp-content/uploads/2024/10/Teologia-hero-2024-miniatura.webp",
    label: "TEOLOGÍA",
    link: "#",
  },
  {
    image: "https://www.unac.edu.co/wp-content/uploads/2024/10/Administracion-de-Empresas-hero-2024-miniatura.webp",
    label: "ADMINISTRACIÓN DE EMPRESAS",
    link: "#",
  },
];
export const Programas = () => {
  return (
    <section id="programas" className="bg-navy-900 px-6 py-24 md:px-12">
      <AccordionGallery
        items={items}
        defaultIndex={2}
        expandRatio={0.52}
        trigger="hover"
        accentColor="#ffffff"
        overlayColor="#060010"
        textColor="#ffffff"
        grayscale
        showLabels
        duration={0.6}
        ease="power3.out"
        parallax={0.5}
        tilt={8}
        stagger={0.06}
        height={460}
        gap={10}
        radius={16}
        orientation="horizontal"
      />
    </section>
  );
};
