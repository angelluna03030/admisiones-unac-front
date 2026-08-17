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
    image: "https://scontent-bog2-2.xx.fbcdn.net/v/t39.30808-6/670265789_1446760300828781_1243317657707239615_n.jpg?stp=cp6_dst-jpg_tt6&cstp=mx2048x1536&ctp=s2048x1536&_nc_cat=111&ccb=1-7&_nc_sid=127cfc&_nc_ohc=8W0TwL7TZgsQ7kNvwF3zQby&_nc_oc=AdrNE2KkHihSHvEnE_qbR0M_7s-WgK6kb2TSNq7B2UKJy0tLvRsvzIXSl-DW5bXGTFU9PisAhUL_559Xex7brYVb&_nc_zt=23&_nc_ht=scontent-bog2-2.xx&_nc_gid=QjQAhH8HYG0eU_QuHxVfHg&_nc_ss=7b2a8&oh=00_AQGF8NMhyPNpBE2Kj1J-NtTb7rARDDHnbxTtKfzMVQcDbw&oe=6A896378",
    title: "Falls",
    href: "https://example.com/three",
  },
      {
    image: "https://scontent-bog2-2.xx.fbcdn.net/v/t39.30808-6/659795188_1437543195083825_7216334733617194909_n.jpg?stp=dst-jpg_tt6&cstp=mx1920x1080&ctp=s1920x1080&_nc_cat=110&ccb=1-7&_nc_sid=127cfc&_nc_ohc=z0eMO9HSq14Q7kNvwEIxChY&_nc_oc=Adp9yZ2bcXx-N9hgjGOFH7ysGoubneyMTYcoumIZNKahjNPWS45VZwsZ1M6AwnPeazwSU-KRuPXr_f52bBHiPiS3&_nc_zt=23&_nc_ht=scontent-bog2-2.xx&_nc_gid=MERkaDFeKEsjRcNYyk0IQw&_nc_ss=7b2a8&oh=00_AQFJZ7oWqgL3YyrboGuVxs9CdbRrX2e9whZcoErG-Uasmw&oe=6A8948B9",
    title: "Falls",
    href: "https://example.com/three",
  },
        {
    image: "https://scontent-bog2-2.xx.fbcdn.net/v/t39.30808-6/659191604_1435964618575016_7641321007150678949_n.jpg?stp=dst-jpg_tt6&cstp=mx1920x1080&ctp=s1920x1080&_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=q7Y8mQhbDckQ7kNvwG7hSs8&_nc_oc=Adq719ROgJUR__yHYseSKQcul2EAP7A4sSMJGqwzrlIS-eBhMfTVZlVd9bU2YIygxDnqobcJfEdqX0NqxBcqtOUY&_nc_zt=23&_nc_ht=scontent-bog2-2.xx&_nc_gid=2UvxPabK_wLiqUlcvBEPTQ&_nc_ss=7b2a8&oh=00_AQGTiQ8mSD1ttnChx9UdIlV5OvuqgW_q_PXggWpzjV841A&oe=6A8961D9",
    title: "Falls",
    href: "https://example.com/three",
  },
        {
    image: "https://scontent-bog2-2.xx.fbcdn.net/v/t51.82787-15/642120552_18510080848076051_5840486165036742298_n.jpg?stp=dst-jpegr_tt6&cstp=mx1440x1080&ctp=s1440x1080&_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=SO02kOO05KYQ7kNvwHsk2CV&_nc_oc=Adqeot7GTvqUz5d8vPfGyBFztbDg8Q57Teq8QP6QUs0fZCt_Mrpeyw3_kswArzvMexAgl9EK-wjt0dTRHbuKLD2M&_nc_zt=23&se=-1&_nc_ht=scontent-bog2-2.xx&_nc_gid=3wkiQwnbLunLso7xdyCGCw&_nc_ss=7b2a8&oh=00_AQHc4EiYgZYRP9E_gy8MJdue_MJIf8EcpTbs3-pEft__Mg&oe=6A896C10",
    title: "Falls",
    href: "https://example.com/three",
  },      {
    image: "https://scontent-bog2-1.xx.fbcdn.net/v/t51.82787-15/658802407_18517828579076051_3547635310501706024_n.jpg?stp=dst-jpg_tt6&cstp=mx1440x1080&ctp=s1440x1080&_nc_cat=100&ccb=1-7&_nc_sid=127cfc&_nc_ohc=wWM6_-znO1EQ7kNvwEfqd5m&_nc_oc=Adqae5oquFhaiRuZOxKjges4MDrQFB9Y_hvs-wsZLwdLZi_k233tBTo_OUMEiZIBIAlO-TgpfMymX12dqn7BJkd0&_nc_zt=23&_nc_ht=scontent-bog2-1.xx&_nc_gid=cLgHnCYDkeN7ZWEXG8DIag&_nc_ss=7b2a8&oh=00_AQHxcbwBA8VxWNBdAazjBCWAg5WLDY81DCDsFGhzc-UJww&oe=6A89647C",
    title: "Falls",
    href: "https://example.com/three",
  },      {
    image: "https://scontent-bog2-1.xx.fbcdn.net/v/t51.82787-15/658802407_18517828579076051_3547635310501706024_n.jpg?stp=dst-jpg_tt6&cstp=mx1440x1080&ctp=s1440x1080&_nc_cat=100&ccb=1-7&_nc_sid=127cfc&_nc_ohc=wWM6_-znO1EQ7kNvwEfqd5m&_nc_oc=Adqae5oquFhaiRuZOxKjges4MDrQFB9Y_hvs-wsZLwdLZi_k233tBTo_OUMEiZIBIAlO-TgpfMymX12dqn7BJkd0&_nc_zt=23&_nc_ht=scontent-bog2-1.xx&_nc_gid=cLgHnCYDkeN7ZWEXG8DIag&_nc_ss=7b2a8&oh=00_AQHxcbwBA8VxWNBdAazjBCWAg5WLDY81DCDsFGhzc-UJww&oe=6A89647C",
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
