import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, BookOpen, CalendarCheck, UserCog, TrendingUp, ArrowRight } from 'lucide-react';
import { Card, Button } from '@heroui/react';
import { useUsuario } from '../hooks/useUsuario';
import { usePrograma } from '../hooks/usePrograma';
// import { useAspirante } from '../hooks/useAspirante'; // Descomenta cuando lo necesites

export const DashboardPage = () => {
  const { usuarios, fetchUsuarios } = useUsuario();
  const { programas, fetchProgramas } = usePrograma();
  // const { aspirantes, fetchAspirantes } = useAspirante();

  useEffect(() => {
    fetchUsuarios();
    fetchProgramas({ page: 1, limit: 100 });
    // fetchAspirantes({ page: 1, limit: 100 });
  }, [fetchUsuarios, fetchProgramas]);

  const stats = [
    {
      title: 'Total Programas',
      value: programas.length,
      icon: BookOpen,
      color: 'bg-blue-500',
      textColor: 'text-blue-500',
      link: '/programas',
    },
    {
      title: 'Usuarios del Sistema',
      value: usuarios.length,
      icon: UserCog,
      color: 'bg-purple-500',
      textColor: 'text-purple-500',
      link: '/usuarios',
    },
    {
      title: 'Pre-inscripciones',
      value: '0', // Reemplazar con aspirantes.length cuando conectes el hook
      icon: Users,
      color: 'bg-emerald-500',
      textColor: 'text-emerald-500',
      link: '/aspirantes',
    },
    {
      title: 'Entrevistas Pendientes',
      value: '0', // Reemplazar con dato real del módulo de entrevistas
      icon: CalendarCheck,
      color: 'bg-amber-500',
      textColor: 'text-amber-500',
      link: '/entrevistas',
    },
  ];

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      {/* Encabezado */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Panel de Administración</h1>
        <p className="text-default-500 mt-1">Bienvenido al sistema de gestión de admisiones UNAC.</p>
      </div>

      {/* Tarjetas de Estadísticas (KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="border border-default-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-default-500">{stat.title}</p>
                  <p className="text-3xl font-bold text-foreground mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl ${stat.color} bg-opacity-10`}>
                  <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
              </div>
          
              <Link to={stat.link}>
                <Button variant="outline" size="sm" className="w-full justify-between text-default-600 hover:text-primary">
                  Ver detalles
                  <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>

      {/* Accesos Rápidos */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp size={20} className="text-primary" />
          Accesos Rápidos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/aspirantes">
            <Card className="border border-default-200 hover:border-primary/50 transition-colors cursor-pointer">
              <div className="p-6 flex items-center gap-4">
                <div className="p-3 rounded-full bg-primary-100 text-primary-600">
                  <Users size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Gestionar Aspirantes</h3>
                  <p className="text-sm text-default-500">Revisar pre-inscripciones y documentos</p>
                </div>
              </div>
            </Card>
          </Link>

          <Link to="/programas">
            <Card className="border border-default-200 hover:border-primary/50 transition-colors cursor-pointer">
              <div className="p-6 flex items-center gap-4">
                <div className="p-3 rounded-full bg-success-100 text-success-600">
                  <BookOpen size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Programas Académicos</h3>
                  <p className="text-sm text-default-500">Administrar oferta académica y cupos</p>
                </div>
              </div>
            </Card>
          </Link>

          <Link to="/usuarios">
            <Card className="border border-default-200 hover:border-primary/50 transition-colors cursor-pointer">
              <div className="p-6 flex items-center gap-4">
                <div className="p-3 rounded-full bg-warning-100 text-warning-600">
                  <UserCog size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Usuarios y Roles</h3>
                  <p className="text-sm text-default-500">Gestionar evaluadores y personal</p>
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
};