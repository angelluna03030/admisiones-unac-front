import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FilePlus2, FileText } from 'lucide-react';
import { Button, Input, ListBox, Select, type Key } from '@heroui/react';
import { TablaDocumentos } from '../components/ui/documentos/TablaDocumentos';
import { DocumentoModal } from '../components/ui/documentos/DocumentoModal';
import { documentoApi } from '../api/documento';
import { useDocumento } from '../hooks/useDocumento';
import {
  ESTADOS_DOCUMENTO,
  TIPOS_DOCUMENTO,
  getTipoDocumento,
  type EstadoDocumento,
  type TipoDocumento,
} from '../types/Documento';
import { useAuthStore } from '../stores/authStore';
import { puede } from '../utils/permisos';

const TARJETAS: { estado: EstadoDocumento; titulo: string; clase: string }[] = [
  { estado: 'CARGADO', titulo: 'Por validar', clase: 'text-accent' },
  { estado: 'PENDIENTE', titulo: 'Pendientes de carga', clase: 'text-default-600' },
  { estado: 'VALIDADO', titulo: 'Validados', clase: 'text-success' },
  { estado: 'RECHAZADO', titulo: 'Rechazados', clase: 'text-danger' },
];

export const DocumentosPage = () => {
  const rol = useAuthStore((state) => state.usuario?.rol);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { documentos, fetchDocumentos, setSelectedDocumento } = useDocumento();
  // Conteos de todas las tarjetas, independientes del filtro de estado aplicado
  const [conteos, setConteos] = useState<Record<string, number>>({});

  const estado = (searchParams.get('estado') as EstadoDocumento | null) ?? undefined;
  const tipo = (searchParams.get('tipo') as TipoDocumento | null) ?? undefined;

  useEffect(() => {
    fetchDocumentos({ estado, tipo });
  }, [estado, tipo, fetchDocumentos]);

  // Se recalcula cada vez que cambia la lista (validar, rechazar, registrar...)
  useEffect(() => {
    documentoApi
      .getAll({ tipo })
      .then((response) =>
        setConteos(
          (response.data || []).reduce<Record<string, number>>(
            (acc, d) => ({ ...acc, [d.estado]: (acc[d.estado] ?? 0) + 1 }),
            {},
          ),
        ),
      )
      .catch(() => setConteos({}));
  }, [documentos, tipo]);

  const setFiltro = (key: 'estado' | 'tipo', value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value && value !== 'all') next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  };

  const term = searchTerm.trim().toLowerCase();
  const filtrados = term
    ? documentos.filter((d) =>
        [
          d.solicitud.aspirante.nombres,
          d.solicitud.aspirante.apellidos,
          d.solicitud.aspirante.numeroDocumento,
          d.solicitud.programa.nombre,
          getTipoDocumento(d.tipo),
        ]
          .join(' ')
          .toLowerCase()
          .includes(term),
      )
    : documentos;

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary-100 text-primary-600 shrink-0">
            <FileText size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Documentos</h1>
            <p className="text-default-500 text-sm mt-0.5">
              Recibe y valida los documentos de las solicitudes (paso 3 del proceso).
            </p>
          </div>
        </div>
        {puede(rol, 'documentos') && (
          <Button
            onPress={() => {
              setSelectedDocumento(null);
              setIsModalOpen(true);
            }}
          >
            <FilePlus2 size={18} /> Registrar Documento
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {TARJETAS.map((t) => {
          const activa = estado === t.estado;
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
          placeholder="Buscar por aspirante, documento o programa..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="md:max-w-md md:flex-1"
        />

        <Select
          aria-label="Filtrar por tipo"
          className="md:w-60"
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
              {TIPOS_DOCUMENTO.map((t) => (
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
              {ESTADOS_DOCUMENTO.map((e) => (
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
        <TablaDocumentos
          items={filtrados}
          onEdit={(d) => {
            setSelectedDocumento(d);
            setIsModalOpen(true);
          }}
        />
      </div>

      <DocumentoModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedDocumento(null);
        }}
      />
    </div>
  );
};
