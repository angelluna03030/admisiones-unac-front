import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  CalendarCheck,
  ClipboardList,
  FileText,
  Gavel,
  KeyRound,
  LayoutDashboard,
  LogOut,
  MessageSquareWarning,
  UserCog,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { puede, ROL_LABEL, type Accion } from '../../utils/permisos';
import { CambiarPasswordModal } from './CambiarPasswordModal';

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  /** Si se indica, el enlace solo se muestra a quien tenga permiso para esa acción */
  accion?: Accion;
}

const NAV_ITEMS: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/programas', label: 'Programas Académicos', icon: BookOpen },
  { to: '/aspirantes', label: 'Aspirantes', icon: Users },
  { to: '/solicitudes', label: 'Solicitudes', icon: ClipboardList },
  { to: '/documentos', label: 'Documentos', icon: FileText },
  { to: '/observaciones', label: 'Observaciones', icon: MessageSquareWarning },
  { to: '/entrevistas', label: 'Entrevistas', icon: CalendarCheck },
  { to: '/decisiones', label: 'Decisiones', icon: Gavel },
  { to: '/usuarios', label: 'Usuarios', icon: UserCog, accion: 'usuarios' },
];

export const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { usuario, logout } = useAuthStore();
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;
  const items = NAV_ITEMS.filter((item) => !item.accion || puede(usuario?.rol, item.accion));

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const iniciales = usuario ? `${usuario.nombres.trim()[0] ?? ''}${usuario.apellidos.trim()[0] ?? ''}`.toUpperCase() : '';

  return (
    <div className="flex min-h-screen bg-default-50">
      <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r border-default-200 bg-background">
        <div className="border-b border-default-200 p-6">
          <h1 className="flex items-center gap-2 text-xl font-bold text-primary">
            <BookOpen size={24} />
            Admisiones
          </h1>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {items.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 rounded-lg px-4 py-2.5 transition-colors ${
                isActive(to) ? 'bg-primary-100 font-medium text-primary-600' : 'text-default-600 hover:bg-default-100'
              }`}
            >
              <Icon size={20} />
              {label}
            </Link>
          ))}
        </nav>

        {usuario && (
          <div className="border-t border-default-200 p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-600">
                {iniciales}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">
                  {usuario.nombres} {usuario.apellidos}
                </p>
                <p className="truncate text-xs text-default-500">{ROL_LABEL[usuario.rol]}</p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setIsPasswordOpen(true)}
                className="flex items-center justify-center gap-1.5 rounded-lg border border-default-200 px-2 py-1.5 text-xs text-default-600 transition hover:bg-default-100"
              >
                <KeyRound size={14} /> Contraseña
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center justify-center gap-1.5 rounded-lg border border-default-200 px-2 py-1.5 text-xs text-danger transition hover:bg-danger/10"
              >
                <LogOut size={14} /> Salir
              </button>
            </div>
          </div>
        )}
      </aside>

      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>

      <CambiarPasswordModal isOpen={isPasswordOpen} onClose={() => setIsPasswordOpen(false)} />
    </div>
  );
};
