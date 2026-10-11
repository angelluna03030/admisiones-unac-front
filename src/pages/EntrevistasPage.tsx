import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CalendarCheck, CalendarPlus } from 'lucide-react';
import { Button, Input, ListBox, Select, type Key } from '@heroui/react';
import { TablaEntrevistas } from '../components/ui/entrevistas/TablaEntrevistas';
import { EntrevistaModal } from '../components/ui/entrevistas/EntrevistaModal';
import { EvaluacionModal } from '../components/ui/entrevistas/EvaluacionModal';
import { useEntrevista } from '../hooks/useEntrevista';
import {
  ESTADOS_ENTREVISTA,
  TIPOS_ENTREVISTA,
  type Entrevista,
  type EstadoEntrevista,
  type TipoEntrevista,
} from '../types/Entrevista';
import { useAuthStore } from '../stores/authStore';
import { puede } from '../utils/permisos';

export const EntrevistasPage = () => {
  const rol = useAuthStore((state) => state.usuario?.rol);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [aEvaluar, setAEvaluar] = useState<Entrevista | null>(null);
  const { entrevistas, fetchEntrevistas, setSelectedEntrevista } = useEntrevista();

  const estado = (searchParams.get('estado') as EstadoEntrevista | null) ?? undefined;
  const tipo = (searchParams.get('tipo') as TipoEntrevista | null) ?? undefined;

  useEffect(() => {
    fetchEntrevistas({ estado, tipo });
  }, [estado, tipo, fetchEntrevistas]);

  const setFiltro = (key: 'estado' | 'tipo', value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value && value !== 'all') next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  };

  const term = searchTerm.trim().toLowerCase();
  const filtradas = term
    ? entrevistas.filter((e) =>
        [
          e.solicitud.aspirante.nombres,
          e.solicitud.aspirante.apellidos,
          e.solicitud.aspirante.numeroDocumento,
          e.solicitud.programa.nombre,
          e.evaluador ? `${e.evaluador.nombres} ${e.evaluador.apellidos}` : '',
        ]
          .join(' ')
          .toLowerCase()
          .includes(term),
      )
    : entrevistas;

  const pendientes = entrevistas.filter((e) => e.estado === 'PENDIENTE' || e.estado === 'REPROGRAMADA').length;

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary-100 text-primary-600 shrink-0">
            <CalendarCheck size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Entrevistas</h1>
            <p className="text-default-500 text-sm mt-0.5">
              Agenda y evalúa las entrevistas de Capellanía y Académicas.
              <span className="ml-1 text-default-400">
                · {entrevistas.length} en total · {pendientes} por realizar
              </span>
            </p>
          </div>
        </div>
        {puede(rol, 'entrevistas') && (
          <Button
            onPress={() => {
              setSelectedEntrevista(null);
              setIsModalOpen(true);
            }}
          >
            <CalendarPlus size={18} /> Programar Entrevista
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-3 bg-default-50 p-4 rounded-xl border border-default-200 md:flex-row md:items-center">
        <Input
          placeholder="Buscar por aspirante, programa o evaluador..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="md:max-w-md md:flex-1"
        />

        <Select
          aria-label="Filtrar por tipo"
          className="md:w-52"
          value={(tipo ?? 'all') as Key}
          onChange={(key) => setFiltro('tipo', key ? String(key) : '')}
        >
          <Select.Trigger>
            <Select.Value />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox>
              <ListBox.Item id="all" textValue="Todos los tipos">
                Todos los tipos
                <ListBox.ItemIndicator />
              </ListBox.Item>
              {TIPOS_ENTREVISTA.map((t) => (
                <ListBox.Item key={t.id} id={t.id} textValue={t.label}>
                  {t.label}
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              ))}
            </ListBox>
          </Select.Popover>
        </Select>

        <Select
          aria-label="Filtrar por estado"
          className="md:w-52"
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
              {ESTADOS_ENTREVISTA.map((e) => (
                <ListBox.Item key={e.id} id={e.id} textValue={e.label}>
                  {e.label}
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              ))}
            </ListBox>
          </Select.Popover>
        </Select>
      </div>

      <div className="bg-background rounded-xl border border-default-200 p-4">
        <TablaEntrevistas
          items={filtradas}
          onEdit={(e) => {
            setSelectedEntrevista(e);
            setIsModalOpen(true);
          }}
          onEvaluate={setAEvaluar}
        />
      </div>

      <EntrevistaModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <EvaluacionModal entrevista={aEvaluar} onClose={() => setAEvaluar(null)} />
    </div>
  );
};
