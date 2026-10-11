# Admisiones UNAC · Frontend

Aplicación web del sistema de admisiones de la UNAC. Incluye dos partes:

- **Landing pública** (`/`): presenta los programas y la vida universitaria, tiene el formulario de pre-inscripción y **Uni**, un asistente con IA que responde dudas, pre-inscribe y envía la información por WhatsApp.
- **Panel administrativo** (`/dashboard`…): gestión del proceso de admisión por roles, protegido con inicio de sesión.

> Forma parte de tres proyectos: **front** (este), **[back](../back/README.md)** y **[n8n](../n8n/README.md)** (automatizaciones).

## Stack

| | |
|---|---|
| Framework | React 19 + TypeScript + Vite |
| UI | HeroUI v3 · Tailwind CSS v4 · lucide-react |
| Estado | Zustand |
| HTTP | Axios (`withCredentials` para la cookie de sesión) |
| Animación | framer-motion (chat) · GSAP (galería) · canvas (hero de partículas) |
| Otros | react-router-dom · Zod · Recharts (dashboard) · SweetAlert2 |

## Puesta en marcha

Requiere el [backend](../back/README.md) corriendo en `http://localhost:3000`.

```bash
bun install
cp .env.example .env    # VITE_API_URL=http://localhost:3000
bun run dev             # http://localhost:5173
```

| Script | Qué hace |
|---|---|
| `bun run dev` | Servidor de desarrollo |
| `bun run build` | Revisión de tipos (`tsc -b`) + build de producción en `dist/` |
| `bun run preview` | Sirve el build localmente |
| `bun run lint` | ESLint |

> El backend solo acepta peticiones con CORS desde `http://localhost:5173`. Si cambias el puerto o el dominio, ajústalo en `back/src/app.ts`.

## Rutas

| Ruta | Acceso | Descripción |
|---|---|---|
| `/` | Público | Landing, formulario de pre-inscripción y chat |
| `/login` | Público | Inicio de sesión del panel |
| `/dashboard` | Sesión | KPIs, embudo, conversión, tendencias y alertas |
| `/programas` | Sesión | Oferta académica |
| `/aspirantes` | Sesión | Datos de los aspirantes |
| `/solicitudes` | Sesión | Solicitudes y su avance por el proceso |
| `/documentos` | Sesión | Recepción y validación de documentos |
| `/observaciones` | Sesión | Observaciones al aspirante (con aviso por WhatsApp) |
| `/entrevistas` | Sesión | Agenda y evaluación de entrevistas |
| `/decisiones` | Sesión | Decisión de Coordinación y ratificación de Vicerrectoría |
| `/usuarios` | Solo `ADMIN` | Funcionarios, roles y contraseñas |

**Sin sesión:** cualquier ruta del panel redirige a `/login?redirect=…` y vuelve a la página original después de entrar.

**Por rol:** los botones de crear o editar solo se muestran a quien tiene permiso (`src/utils/permisos.ts`, que replica las reglas del backend). El backend vuelve a validar cada acción.

## Estructura

```
src/
├── App.tsx                 # Rutas; las páginas del panel se cargan bajo demanda (lazy)
├── pages/                  # Una página por módulo + LoginPage + AdmissionsLanding
├── components/
│   ├── Hero, programas, vida, AdmissionForm, Footer   # Secciones de la landing
│   ├── chat/               # ChatWidget (asistente Uni) y ChatMarkdown
│   ├── common/             # MainLayout, ProtectedRoute, CambiarPasswordModal
│   └── ui/<modulo>/        # Tablas y modales de cada módulo + efectos visuales
├── api/                    # Cliente Axios y llamadas por módulo
├── stores/                 # Stores de Zustand (incluye authStore)
├── hooks/                  # Hooks por módulo + useEnVista
├── types/                  # Tipos, etiquetas y colores de estados por módulo
└── utils/                  # format.ts (fechas, moneda), permisos.ts
```

Cada módulo sigue el mismo patrón: `types/X.ts` → `api/x.ts` → `stores/xStore.ts` → `hooks/useX.ts` → `pages/XPage.tsx` + `components/ui/x/{TablaX, XModal}.tsx`.

## Sesión

- **Cookie:** la sesión vive en una cookie `httpOnly` que pone el backend. El front no guarda ningún token.
- **Store:** `authStore` verifica la sesión con `GET /api/auth/me` y guarda el usuario y su rol.
- **Sesión vencida:** si cualquier petición recibe `401`, `apiClient` emite un evento y la app vuelve a `/login`.
- **Contraseña:** cada usuario puede cambiar la suya desde el botón **Contraseña** de la barra lateral.

## Chat "Uni"

Lo que puede hacer:
- Responder sobre la admisión, los pasos del proceso, las becas y la vida universitaria.
- Consultar los programas reales.
- **Pre-inscribir** a la persona y darle su código de solicitud.
- **Enviarle la información por WhatsApp.**

Cómo funciona por dentro:
- **Conversación:** se guarda por `sessionId` (en `localStorage`) y el historial de la visita en `sessionStorage`.
- **Ruta del mensaje:** `ChatWidget` → `POST /api/chat` (backend) → agente de n8n con DeepSeek.
- **Cambiar su comportamiento:** se edita el *System Message* del nodo **Agente Admisiones** en n8n, sin tocar este código.

## Rendimiento de la landing

- **Carga inicial:** el hero se pinta primero. Las secciones de abajo y el chat se descargan apenas el navegador queda libre (`requestIdleCallback`), y el panel administrativo nunca se descarga en la landing.
- **Pausa automática:** las animaciones (partículas, muros animados) se pausan cuando no están en pantalla o la pestaña está en segundo plano (`hooks/useEnVista.ts`).
- **Partículas del título:** se dibujan por lotes de color, sin `shadowBlur` por partícula, y bajan a ~30 fps en reposo.
- **Imágenes:** las de las galerías usan `loading="lazy"`.
- **Movimiento reducido:** se respeta `prefers-reduced-motion`.
