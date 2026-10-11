import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Gavel, Plus } from 'lucide-react';
import { Button, Input, ListBox, Select, type Key } from '@heroui/react';
import { TablaDecisiones } from '../components/ui/decisiones/TablaDecisiones';
import { DecisionModal } from '../components/ui/decisiones/DecisionModal';
import { RatificacionModal } from '../components/ui/decisiones/RatificacionModal';
import { decisionApi } from '../api/decision';
import { useDecision } from '../hooks/useDecision';
import {
  ESTADOS_RATIFICACION,
  TIPOS_DECISION,
  type Decision,
  type EstadoRatificacion,
  type TipoDecision,
} from '../types/Decision';
import { useAuthStore } from '../stores/authStore';
import { puede } from '../utils/permisos';

const TARJETAS: { estado: EstadoRatificacion; titulo: string; clase: string }[] = [
  { estado: 'PENDIENTE', titulo: 'Pendientes de ratificación', clase: 'text-warning' },
  { estado: 'RATIFICADA', titulo: 'Ratificadas', clase: 'text-success' },
  { estado: 'RECHAZADA', titulo: 'No ratificadas', clase: 'text-danger' },
];

export const DecisionesPage = () => {
  const rol = useAuthStore((state) => state.usuario?.rol);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [aRatificar, setARatificar] = useState<Decision | null>(null);
  const [conteos, setConteos] = useState<Record<string, number>>({});
  const { decisiones, fetchDecisiones, setSelectedDecision } = useDecision();

  const estadoRatificacion = (searchParams.get('estado') as EstadoRatificacion | null) ?? undefined;
  const tipo = (searchParams.get('tipo') as TipoDecision | null) ?? undefined;

  useEffect(() => {
    fetchDecisiones({ estadoRatificacion, tipo });
  }, [estadoRatificacion, tipo, fetchDecisiones]);

  // Conteos de las tarjetas, independientes del filtro de ratificación aplicado
  useEffect(() => {
    decisionApi
      .getAll({ tipo })
      .then((response) =>
        setConteos(
          (response.data || []).reduce<Record<string, number>>(
            (acc, d) => ({ ...acc, [d.estadoRatificacion]: (acc[d.estadoRatificacion] ?? 0) + 1 }),
            {},
          ),
        ),
      )
      .catch(() => setConteos({}));
  }, [decisiones, tipo]);

  const setFiltro = (key: 'estado' | 'tipo', value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value && value !== 'all') next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  };

  const term = searchTerm.trim().toLowerCase();
  const filtradas = term
    ? decisiones.filter((d) =>
        [
          d.solicitud.aspirante.nombres,
          d.solicitud.aspirante.apellidos,
          d.solicitud.aspirante.numeroDocumento,
          d.solicitud.programa.nombre,
          `${d.tomadaPor.nombres} ${d.tomadaPor.apellidos}`,
        ]
          .join(' ')
          .toLowerCase()
          .includes(term),
      )
    : decisiones;

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary-100 text-primary-600 shrink-0">
            <Gavel size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Decisiones de Admisión</h1>
            <p className="text-default-500 text-sm mt-0.5">
              Coordinación decide tras las entrevistas y Vicerrectoría ratifica.
            </p>
          </div>
        </div>
        {puede(rol, 'decidir') && (
          <Button
            onPress={() => {
              setSelectedDecision(null);
              setIsModalOpen(true);
            }}
          >
            <Plus size={18} /> Registrar Decisión
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {TARJETAS.map((t) => {
          const activa = estadoRatificacion === t.estado;
          return (
            <button
              key={t.estado}
              type="button"
              onClick={() => setFiltro('estado', activa ? '' : t.estado)}
              className={`rounded-xl border p-4 text-left transition hover:border-primary-300 ${
                activa ? 'border-primary-400 bg-primary-50' : 'border-default-200 bg-background'
              }`}
            >
              <p className="text-xs text-default-500">{t.titulo}</p>
              <p className={`mt-1 text-2xl font-bold ${t.clase}`}>{conteos[t.estado] ?? 0}</p>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-3 bg-default-50 p-4 rounded-xl border border-default-200 md:flex-row md:items-center">
        <Input
          placeholder="Buscar por aspirante, programa o coordinador..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="md:max-w-md md:flex-1"
        />

        <Select
          aria-label="Filtrar por decisión"
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
              <ListBox.Item id="all" textValue="Todas las decisiones">
                Todas las decisiones
                <ListBox.ItemIndicator />
              </ListBox.Item>
              {TIPOS_DECISION.map((t) => (
                <ListBox.Item key={t.id} id={t.id} textValue={t.label}>
                  {t.label}
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              ))}
            </ListBox>
          </Select.Popover>
        </Select>

        <Select
          aria-label="Filtrar por ratificación"
          className="md:w-52"
          value={(estadoRatificacion ?? 'all') as Key}
          onChange={(key) => setFiltro('estado', key ? String(key) : '')}
        >
          <Select.Trigger>
            <Select.Value />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox>
              <ListBox.Item id="all" textValue="Toda ratificación">
                Toda ratificación
                <ListBox.ItemIndicator />
              </ListBox.Item>
              {ESTADOS_RATIFICACION.map((e) => (
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
        <TablaDecisiones
          items={filtradas}
          onEdit={(d) => {
            setSelectedDecision(d);
            setIsModalOpen(true);
          }}
          onRatificar={setARatificar}
        />
      </div>

      <DecisionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedDecision(null);
        }}
      />
      <RatificacionModal decision={aRatificar} onClose={() => setARatificar(null)} />
    </div>
  );
};
