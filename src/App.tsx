import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './index.css';

// Páginas (Ajusta las rutas de importación según dónde las tengas)
import AdmissionsLanding from './pages/AdmissionsLanding';
import { ProgramasPage } from './pages/ProgramasPage'; // La que acabamos de crear
import { AspirantesPage } from './pages/AspirantesPage';
import { UsuariosPage } from './pages/UsuariosPage';
// Layout
import { MainLayout } from './components/common/MainLayout';

// Placeholder para el Dashboard (puedes crear este archivo o usar el que ya tengas)
const Dashboard = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold">Bienvenido al Dashboard de Admisiones</h1>
    <p className="text-default-500 mt-2">Selecciona una opción del menú lateral.</p>
  </div>
);

// Placeholder para Página no encontrada
const PageNotFound = () => (
  <div className="flex flex-col items-center justify-center min-h-screen">
    <h1 className="text-6xl font-bold text-default-300">404</h1>
    <p className="text-xl text-default-500 mt-4">Página no encontrada</p>
    <a href="/" className="mt-4 text-primary hover:underline">Volver al inicio</a>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. Rutas Públicas (Sin Layout) */}
        <Route path="/" element={<AdmissionsLanding />} />
        
        {/* Si tienes una página de Login separada, descomenta la siguiente línea y ajusta la ruta */}
        {/* <Route path="/login" element={<Login />} /> */}

        {/* 2. Rutas de la Aplicación (Con Layout Sencillo, SIN protección) */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Ruta de Programas Académicos */}
          <Route path="/programas" element={<ProgramasPage />} />
          <Route path="/aspirantes" element={<AspirantesPage />} />
           <Route path="/usuarios" element={<UsuariosPage />} />
          {/* Aquí agregaremos más rutas en el futuro: */}
          {/* <Route path="/aspirantes" element={<AspirantesPage />} /> */}
          {/* <Route path="/solicitudes" element={<SolicitudesPage />} /> */}
        </Route>

        {/* 3. Rutas de Error y Redirección */}
        <Route path="/404" element={<PageNotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </BrowserRouter>
  );
}