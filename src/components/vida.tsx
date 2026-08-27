import DriftWall from "./ui/DriftWall2";

const items = [
  {
    image: "https://www.unac.edu.co/wp-content/uploads/2026/03/Estudiantes-de-enfermeria-UNAC-en-el-impacto-del-global-youth-day-2026-en-moravia.webp",
    title: "Peaks",
    href: "https://example.com/one",
  },
  {
    image: "https://www.unac.edu.co/wp-content/uploads/2025/12/La-docente-unac-edna-conde-vega-en-la-upeu-como-parte-de-la-cooperacion-internacional-icetex-2.webp",
    title: "Pup",
    href: "https://example.com/two",
  },
  {
    image: "https://th.bing.com/th/id/R.5e96df6bb827d1cfd8d5b7ef2b408892?rik=%2fxNZFqvZ8bdvQw&pid=ImgRaw&r=0",
    title: "Falls",
    href: "https://example.com/three",
  },
     {
    image: "https://www.unac.edu.co/wp-content/uploads/2026/03/Estudiantes-de-enfermeria-UNAC-en-el-impacto-del-global-youth-day-2026-en-moravia.webp",
    title: "Peaks",
    href: "https://example.com/one",
  },
  {
    image: "https://www.unac.edu.co/wp-content/uploads/2025/12/La-docente-unac-edna-conde-vega-en-la-upeu-como-parte-de-la-cooperacion-internacional-icetex-2.webp",
    title: "Pup",
    href: "https://example.com/two",
  },
  {
    image: "https://th.bing.com/th/id/R.5e96df6bb827d1cfd8d5b7ef2b408892?rik=%2fxNZFqvZ8bdvQw&pid=ImgRaw&r=0",
    title: "Falls",
    href: "https://example.com/three",
  },
];
export const Vida = () => {
  return (
    <>
      <section id="#vida" className="bg-navy-900 px-6 py-24 md:px-12">
        <div style={{ height: 600 }}>
          <DriftWall
            items={items}
            columns={8}
            tileWidth={300}
            tileHeight={132}
            gap={18}
            tilt={16}
            turn={-14}
            perspective={1200}
            depth={120}
            speed={42}
            direction="down"
            variance={0.45}
            parallax={0.6}
            lift={64}
            fade={0.8}
            dim={0.55}
            overlayColor="#060010"
            radius={14}
            roll={0}
            pauseOnHover={false}
            grayscale={false}
          />
        </div>
      </section>
    </>
  );
};
