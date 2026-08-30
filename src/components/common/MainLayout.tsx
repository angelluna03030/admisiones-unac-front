import { Outlet, Link, useLocation } from 'react-router-dom';
import { BookOpen, LayoutDashboard, UserCog, Users } from 'lucide-react';

export const MainLayout = () => {
  const location = useLocation();

  // Función auxiliar para saber si un enlace está activo
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex min-h-screen bg-default-50">
      {/* Sidebar Sencillo */}
      <aside className="w-64 bg-background border-r border-default-200 flex flex-col">
        <div className="p-6 border-b border-default-200">
          <h1 className="text-xl font-bold text-primary flex items-center gap-2">
            <BookOpen size={24} />
            Admisiones
          </h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link 
            to="/dashboard" 
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive('/dashboard') ? 'bg-primary-100 text-primary-600 font-medium' : 'text-default-600 hover:bg-default-100'
            }`}
          >
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
          
          <Link 
            to="/programas" 
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive('/programas') ? 'bg-primary-100 text-primary-600 font-medium' : 'text-default-600 hover:bg-default-100'
            }`}
          >
            <BookOpen size={20} />
            Programas Académicos
          </Link>
 <Link 
            to="/aspirantes" 
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive('/aspirantes') ? 'bg-primary-100 text-primary-600 font-medium' : 'text-default-600 hover:bg-default-100'
            }`}
          >
            <Users size={20} />
            Aspirantes
          </Link>
          <Link 
  to="/usuarios" 
  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
    isActive('/usuarios') ? 'bg-primary-100 text-primary-600 font-medium' : 'text-default-600 hover:bg-default-100'
  }`}
>
  <UserCog size={20} />
  Usuarios
</Link>
          {/* Aquí irán los futuros enlaces: Aspirantes, Solicitudes, etc. */}
        </nav>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};