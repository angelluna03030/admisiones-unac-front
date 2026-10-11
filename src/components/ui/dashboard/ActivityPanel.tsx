import { Card } from '@heroui/react';
import { Link } from 'react-router-dom';
import { CalendarClock, ClipboardList } from 'lucide-react';
import type { DashboardActivity } from '../../../types/Dashboard';
import { formatDate, formatDateTime } from '../../../utils/format';
import { EstadoSolicitudChip } from '../solicitudes/EstadoSolicitudChip';

interface ActivityPanelProps {
  activity: DashboardActivity | null;
}

export const ActivityPanel = ({ activity }: ActivityPanelProps) => (
  <Card className="border border-default-200">
    <Card.Content className="space-y-6 p-6">
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="flex items-center gap-2 font-semibold text-foreground">
            <CalendarClock className="h-5 w-5 text-accent" />
            Próximas entrevistas
          </h3>
          <Link to="/entrevistas" className="text-xs text-accent hover:underline">
            Ver todas
          </Link>
        </div>
        {!activity?.proximasEntrevistas.length ? (
          <p className="text-sm text-default-400">No hay entrevistas agendadas.</p>
        ) : (
          <ul className="space-y-2">
            {activity.proximasEntrevistas.map((e) => (
              <li key={e.id} className="rounded-lg bg-default-100 p-2.5 text-sm">
                <p className="font-medium text-foreground">
                  {e.solicitud.aspirante.nombres} {e.solicitud.aspirante.apellidos}
                </p>
                <p className="text-xs text-default-500">
                  {e.tipo === 'CAPELLANIA' ? 'Capellanía' : 'Académica'} · {formatDateTime(e.fechaProgramada)}
                  {e.modalidad ? ` · ${e.modalidad}` : ''}
                </p>
                <p className="text-xs text-default-500">
                  {e.evaluador ? `${e.evaluador.nombres} ${e.evaluador.apellidos}` : 'Sin evaluador asignado'}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="flex items-center gap-2 font-semibold text-foreground">
            <ClipboardList className="h-5 w-5 text-accent" />
            Solicitudes recientes
          </h3>
          <Link to="/solicitudes" className="text-xs text-accent hover:underline">
            Ver todas
          </Link>
        </div>
        {!activity?.solicitudesRecientes.length ? (
          <p className="text-sm text-default-400">Aún no hay solicitudes.</p>
        ) : (
          <ul className="space-y-2">
            {activity.solicitudesRecientes.map((s) => (
              <li key={s.id} className="flex items-center justify-between gap-2 text-sm">
                <div className="min-w-0">
                  <p className="truncate font-medium text-foreground">
                    {s.aspirante.nombres} {s.aspirante.apellidos}
                  </p>
                  <p className="truncate text-xs text-default-500">
                    {s.programa.nombre} · {formatDate(s.createdAt)}
                  </p>
                </div>
                <EstadoSolicitudChip estado={s.estado} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </Card.Content>
  </Card>
);
