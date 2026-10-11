import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Spinner, Toast } from '@heroui/react';
import './index.css';

import AdmissionsLanding from './pages/AdmissionsLanding';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// El panel se carga bajo demanda: la landing no descarga el código (ni las gráficas) del admin
const LoginPage = lazy(() => import('./pages/LoginPage'));
const MainLayout = lazy(() => import('./components/common/MainLayout').then((m) => ({ default: m.MainLayout })));
const DashboardPage = lazy(() => import('./pages/DashboardPage').then((m) => ({ default: m.DashboardPage })));
const ProgramasPage = lazy(() => import('./pages/ProgramasPage').then((m) => ({ default: m.ProgramasPage })));
const AspirantesPage = lazy(() => import('./pages/AspirantesPage').then((m) => ({ default: m.AspirantesPage })));
const UsuariosPage = lazy(() => import('./pages/UsuariosPage').then((m) => ({ default: m.UsuariosPage })));
const SolicitudesPage = lazy(() => import('./pages/SolicitudesPage').then((m) => ({ default: m.SolicitudesPage })));
const EntrevistasPage = lazy(() => import('./pages/EntrevistasPage').then((m) => ({ default: m.EntrevistasPage })));
const DocumentosPage = lazy(() => import('./pages/DocumentosPage').then((m) => ({ default: m.DocumentosPage })));
const DecisionesPage = lazy(() => import('./pages/DecisionesPage').then((m) => ({ default: m.DecisionesPage })));
const ObservacionesPage = lazy(() =>
  import('./pages/ObservacionesPage').then((m) => ({ default: m.ObservacionesPage })),
);

const PageNotFound = () => (
  <div className="flex flex-col items-center justify-center min-h-screen">
    <h1 className="text-6xl font-bold text-default-300">404</h1>
    <p className="text-xl text-default-500 mt-4">Página no encontrada</p>
    <a href="/" className="mt-4 text-primary hover:underline">Volver al inicio</a>
  </div>
);

const Cargando = () => (
  <div className="flex min-h-[60vh] items-center justify-center">
    <Spinner />
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <Toast.Provider placement="top end" />
      <Suspense fallback={<Cargando />}>
        <Routes>
          {/* 1. Rutas públicas */}
          <Route path="/" element={<AdmissionsLanding />} />
          <Route path="/login" element={<LoginPage />} />

          {/* 2. Panel administrativo: requiere sesión */}
          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/programas" element={<ProgramasPage />} />
            <Route path="/aspirantes" element={<AspirantesPage />} />
            <Route path="/solicitudes" element={<SolicitudesPage />} />
            <Route path="/entrevistas" element={<EntrevistasPage />} />
            <Route path="/documentos" element={<DocumentosPage />} />
            <Route path="/observaciones" element={<ObservacionesPage />} />
            <Route path="/decisiones" element={<DecisionesPage />} />
            <Route
              path="/usuarios"
              element={
                <ProtectedRoute accion="usuarios">
                  <UsuariosPage />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* 3. Rutas de error y redirección */}
          <Route path="/404" element={<PageNotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
