import { Card, Button, Chip } from '@heroui/react';
import { useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  CalendarClock,
  CalendarX,
  FileWarning,
  Hourglass,
  ShieldAlert,
  TimerOff,
} from 'lucide-react';
import type { DashboardAlerts } from '../../../types/Dashboard';

interface AlertsPanelProps {
  alerts: DashboardAlerts | null;
}

export const AlertsPanel = ({ alerts }: AlertsPanelProps) => {
  const navigate = useNavigate();
  if (!alerts) return null;

  const alertItems = [
    {
      label: 'Solicitudes observadas',
      value: alerts.solicitudesObservadas,
      icon: AlertCircle,
      color: 'warning',
      iconClass: 'text-warning',
      link: '/solicitudes?estado=OBSERVADO',
    },
    {
      label: 'Entrevistas vencidas sin realizar',
      value: alerts.entrevistasVencidas,
      icon: CalendarX,
      color: 'danger',
      iconClass: 'text-danger',
      link: '/entrevistas?estado=PENDIENTE',
    },
    {
      label: 'Entrevistas próximos 7 días',
      value: alerts.entrevistasProximaSemana,
      icon: CalendarClock,
      color: 'accent',
      iconClass: 'text-accent',
      link: '/entrevistas?estado=PENDIENTE',
    },
    {
      label: 'Documentos por validar',
      value: alerts.documentosPorValidar,
      icon: FileWarning,
      color: 'warning',
      iconClass: 'text-warning',
      link: '/solicitudes?estado=DOCUMENTOS_CARGADOS',
    },
    {
      label: 'Ratificaciones pendientes',
      value: alerts.ratificacionesPendientes,
      icon: ShieldAlert,
      color: 'danger',
      iconClass: 'text-danger',
      link: '/solicitudes?estado=EN_RATIFICACION',
    },
    {
      label: 'Sin movimiento hace +15 días',
      value: alerts.solicitudesEstancadas,
      icon: Hourglass,
      color: 'warning',
      iconClass: 'text-warning',
      link: '/solicitudes',
    },
    {
      label: 'Admitidos con plazo vencido',
      value: alerts.respuestasVencidas,
      icon: TimerOff,
      color: 'danger',
      iconClass: 'text-danger',
      link: '/solicitudes?estado=ADMITIDO',
    },
  ] as const;

  const totalPendientes = alertItems.reduce((acc, item) => acc + item.value, 0);

  return (
    <Card className="border border-default-200">
      <Card.Header className="px-6 pt-4 pb-0">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <AlertCircle className="h-5 w-5 text-warning" />
          Alertas y acciones
          {totalPendientes > 0 && (
            <Chip size="sm" variant="soft" color="danger">
              {totalPendientes}
            </Chip>
          )}
        </h3>
      </Card.Header>
      <Card.Content className="px-6 pt-4 pb-6">
        <div className="space-y-2">
          {alertItems.map((item) => {
            const activa = item.value > 0;
            return (
              <div
                key={item.label}
                className={`flex items-center justify-between gap-2 rounded-lg p-2.5 transition-colors ${
                  activa ? 'bg-default-100 hover:bg-default-200' : 'opacity-60'
                }`}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <item.icon className={`h-4 w-4 shrink-0 ${activa ? item.iconClass : 'text-default-400'}`} />
                  <span className="truncate text-sm text-foreground">{item.label}</span>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Chip color={activa ? item.color : 'default'} variant="soft" size="sm">
                    {item.value}
                  </Chip>
                  <Button size="sm" variant="ghost" isDisabled={!activa} onPress={() => navigate(item.link)}>
                    Ver
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </Card.Content>
    </Card>
  );
};
