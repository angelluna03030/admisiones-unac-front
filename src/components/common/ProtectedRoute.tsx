import { useEffect, type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Spinner } from '@heroui/react';
import { useAuthStore } from '../../stores/authStore';
import { puede, type Accion } from '../../utils/permisos';

interface ProtectedRouteProps {
  children: ReactNode;
  /** Si se indica, además de la sesión exige permiso para esa acción */
  accion?: Accion;
}

/** Exige sesión iniciada; si no la hay, envía al login y vuelve a la página tras entrar. */
export const ProtectedRoute = ({ children, accion }: ProtectedRouteProps) => {
  const { estado, usuario, verificarSesion } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    void verificarSesion();
  }, [verificarSesion]);

  if (estado === 'verificando') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-default-50">
        <Spinner />
      </div>
    );
  }

  if (estado === 'anonimo') {
    const redirect = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${redirect}`} replace />;
  }

  if (accion && !puede(usuario?.rol, accion)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
