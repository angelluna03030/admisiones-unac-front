import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MessageSquarePlus, MessageSquareWarning } from 'lucide-react';
import { Button, Input } from '@heroui/react';
import { TablaObservaciones } from '../components/ui/observaciones/TablaObservaciones';
import { ObservacionModal } from '../components/ui/observaciones/ObservacionModal';
import { observacionApi } from '../api/observacion';
import { useObservacion } from '../hooks/useObservacion';
import { useAuthStore } from '../stores/authStore';
import { puede } from '../utils/permisos';

type Filtro = 'abiertas' | 'resueltas' | 'todas';

const TARJETAS: { id: Filtro; titulo: string; clase: string }[] = [
  { id: 'abiertas', titulo: 'Abiertas', clase: 'text-warning' },
  { id: 'resueltas', titulo: 'Resueltas', clase: 'text-success' },
  { id: 'todas', titulo: 'Total', clase: 'text-foreground' },
];

export const ObservacionesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [conteos, setConteos] = useState({ abiertas: 0, resueltas: 0, todas: 0 });
  const { observaciones, fetchObservaciones, setSelectedObservacion } = useObservacion();
  const rol = useAuthStore((state) => state.usuario?.rol);
  const puedeEditar = puede(rol, 'observaciones');

  const filtro = (searchParams.get('ver') as Filtro | null) ?? 'abiertas';

  useEffect(() => {
    fetchObservaciones({ resuelta: filtro === 'todas' ? undefined : filtro === 'resueltas' });
  }, [filtro, fetchObservaciones]);

  useEffect(() => {
    observacionApi
      .getAll()
      .then((response) => {
        const todas = response.data || [];
        const resueltas = todas.filter((o) => o.resuelta).length;
        setConteos({ abiertas: todas.length - resueltas, resueltas, todas: todas.length });
      })
      .catch(() => setConteos({ abiertas: 0, resueltas: 0, todas: 0 }));
  }, [observaciones]);

  const term = searchTerm.trim().toLowerCase();
  const filtradas = term
    ? observaciones.filter((o) =>
        [
          o.solicitud.aspirante.nombres,
          o.solicitud.aspirante.apellidos,
          o.solicitud.aspirante.numeroDocumento,
          o.solicitud.programa.nombre,
          o.motivo,
        ]
          .join(' ')
          .toLowerCase()
          .includes(term),
      )
    : observaciones;

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary-100 text-primary-600 shrink-0">
            <MessageSquareWarning size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Observaciones de Admisiones</h1>
            <p className="text-default-500 text-sm mt-0.5">
              Reporta lo que el aspirante debe corregir; al resolverlo, la solicitud vuelve a validación.
            </p>
          </div>
        </div>
        {puedeEditar && (
          <Button
            onPress={() => {
              setSelectedObservacion(null);
              setIsModalOpen(true);
            }}
          >
            <MessageSquarePlus size={18} /> Registrar Observación
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {TARJETAS.map((t) => {
          const activa = filtro === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setSearchParams(t.id === 'abiertas' ? {} : { ver: t.id })}
              className={`rounded-xl border p-4 text-left transition hover:border-primary-300 ${
                activa ? 'border-primary-400 bg-primary-50' : 'border-default-200 bg-background'
              }`}
            >
              <p className="text-xs text-default-500">{t.titulo}</p>
              <p className={`mt-1 text-2xl font-bold ${t.clase}`}>{conteos[t.id]}</p>
            </button>
          );
        })}
      </div>

      <div className="bg-default-50 p-4 rounded-xl border border-default-200">
        <Input
          placeholder="Buscar por aspirante, programa o motivo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      <div className="bg-background rounded-xl border border-default-200 p-4">
        <TablaObservaciones
          items={filtradas}
          puedeEditar={puedeEditar}
          onEdit={(o) => {
            setSelectedObservacion(o);
            setIsModalOpen(true);
          }}
        />
      </div>

      <ObservacionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedObservacion(null);
        }}
      />
    </div>
  );
};
