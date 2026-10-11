import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ClipboardList, FilePlus2 } from 'lucide-react';
import { Button, Input, ListBox, Select, type Key } from '@heroui/react';
import { TablaSolicitudes } from '../components/ui/solicitudes/TablaSolicitudes';
import { SolicitudModal } from '../components/ui/solicitudes/SolicitudModal';
import { SolicitudDetalleModal } from '../components/ui/solicitudes/SolicitudDetalleModal';
import { EntrevistaModal } from '../components/ui/entrevistas/EntrevistaModal';
import { useSolicitud } from '../hooks/useSolicitud';
import { usePrograma } from '../hooks/usePrograma';
import { useEntrevista } from '../hooks/useEntrevista';
import { ESTADOS_SOLICITUD, type EstadoSolicitud } from '../types/Solicitud';
import { useAuthStore } from '../stores/authStore';
import { puede } from '../utils/permisos';

export const SolicitudesPage = () => {
  const rol = useAuthStore((state) => state.usuario?.rol);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detalleId, setDetalleId] = useState<string | null>(null);
  const [entrevistaSolicitudId, setEntrevistaSolicitudId] = useState<string | null>(null);

  const { total, fetchSolicitudes, fetchDetalle, setSelectedSolicitud } = useSolicitud();
  const { programas, fetchProgramas } = usePrograma();
  const { setSelectedEntrevista } = useEntrevista();

  // Filtros en la URL para poder llegar desde las alertas del dashboard (?estado=OBSERVADO)
  const estado = (searchParams.get('estado') as EstadoSolicitud | null) ?? undefined;
  const programaId = searchParams.get('programaId') ?? undefined;

  useEffect(() => {
    fetchProgramas({ page: 1, limit: 100 });
  }, [fetchProgramas]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchSolicitudes({ search: searchTerm.trim() || undefined, estado, programaId, page: 1 });
    }, 400);
    return () => clearTimeout(timeout);
  }, [searchTerm, estado, programaId, fetchSolicitudes]);

  const setFiltro = (key: 'estado' | 'programaId', value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value && value !== 'all') next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  };

  const handleOpenCreate = () => {
    setSelectedSolicitud(null);
    setIsModalOpen(true);
  };

  const handleProgramarEntrevista = (solicitudId: string) => {
    setSelectedEntrevista(null);
    setEntrevistaSolicitudId(solicitudId);
  };

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary-100 text-primary-600 shrink-0">
            <ClipboardList size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Solicitudes de Admisión</h1>
            <p className="text-default-500 text-sm mt-0.5">
              Sigue cada aspirante a lo largo del proceso de admisión.
              <span className="ml-1 text-default-400">· {total} solicitudes</span>
            </p>
          </div>
        </div>
        {puede(rol, 'solicitudes') && (
          <Button onPress={handleOpenCreate}>
            <FilePlus2 size={18} /> Nueva Solicitud
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-3 bg-default-50 p-4 rounded-xl border border-default-200 md:flex-row md:items-center">
        <Input
          placeholder="Buscar por aspirante, documento o código..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="md:max-w-md md:flex-1"
        />

        <Select
          aria-label="Filtrar por estado"
          className="md:w-60"
          value={(estado ?? 'all') as Key}
          onChange={(key) => setFiltro('estado', key ? String(key) : '')}
        >
          <Select.Trigger>
            <Select.Value />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox>
              <ListBox.Item id="all" textValue="Todos los estados">
                Todos los estados
                <ListBox.ItemIndicator />
              </ListBox.Item>
              {ESTADOS_SOLICITUD.map((e) => (
                <ListBox.Item key={e.id} id={e.id} textValue={e.label}>
                  {e.label}
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              ))}
            </ListBox>
          </Select.Popover>
        </Select>

        <Select
          aria-label="Filtrar por programa"
          className="md:w-60"
          value={(programaId ?? 'all') as Key}
          onChange={(key) => setFiltro('programaId', key ? String(key) : '')}
        >
          <Select.Trigger>
            <Select.Value />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox>
              <ListBox.Item id="all" textValue="Todos los programas">
                Todos los programas
                <ListBox.ItemIndicator />
              </ListBox.Item>
              {programas.map((p) => (
                <ListBox.Item key={p.id} id={p.id} textValue={p.nombre}>
                  {p.nombre}
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              ))}
            </ListBox>
          </Select.Popover>
        </Select>
      </div>

      <div className="bg-background rounded-xl border border-default-200 p-4">
        <TablaSolicitudes
          onView={(s) => setDetalleId(s.id)}
          onEdit={(s) => {
            setSelectedSolicitud(s);
            setIsModalOpen(true);
          }}
        />
      </div>

      <SolicitudModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <SolicitudDetalleModal
        solicitudId={detalleId}
        onClose={() => setDetalleId(null)}
        onProgramarEntrevista={handleProgramarEntrevista}
      />

      <EntrevistaModal
        isOpen={!!entrevistaSolicitudId}
        defaultSolicitudId={entrevistaSolicitudId}
        onClose={() => setEntrevistaSolicitudId(null)}
        onSaved={() => {
          if (detalleId) fetchDetalle(detalleId);
          fetchSolicitudes();
        }}
      />
    </div>
  );
};
