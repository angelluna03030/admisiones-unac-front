import { useEffect } from 'react';
import {
  Users,
  UserCheck,
  TrendingUp,
  DollarSign,
  Download,
  FilterX,
  Hourglass,
  GraduationCap,
  CalendarCheck,
  Star,
  Clock,
  RefreshCw,
} from 'lucide-react';
import { Card, Button, Select, Input, Spinner, ListBox, type Key } from '@heroui/react';
import { useDashboard } from '../hooks/useDashboard';
import { usePrograma } from '../hooks/usePrograma';
import { KPICard, StatTile } from '../components/ui/dashboard/KPICard';
import { FunnelChart } from '../components/ui/dashboard/FunnelChart';
import { ConversionFunnel } from '../components/ui/dashboard/ConversionFunnel';
import { TrendsChart } from '../components/ui/dashboard/TrendsChart';
import { AlertsPanel } from '../components/ui/dashboard/AlertsPanel';
import { ProgramMetricsTable } from '../components/ui/dashboard/ProgramMetricsTable';
import { ActivityPanel } from '../components/ui/dashboard/ActivityPanel';
import type { TrendGroupBy } from '../types/Dashboard';
import { formatCurrency, formatCurrencyCompact } from '../utils/format';

const GROUP_BY_OPTIONS: { id: TrendGroupBy; label: string }[] = [
  { id: 'day', label: 'Día' },
  { id: 'week', label: 'Semana' },
  { id: 'month', label: 'Mes' },
];

const toCsvCell = (value: unknown) => `"${String(value ?? '').replace(/"/g, '""')}"`;

export const DashboardPage = () => {
  const {
    kpis,
    funnel,
    conversion,
    alerts,
    trends,
    programas: metricasProgramas,
    activity,
    trendGroupBy,
    isLoading,
    error,
    filters,
    setFilters,
    fetchDashboardData,
    fetchTrends,
  } = useDashboard();
  const { programas, fetchProgramas } = usePrograma();

  useEffect(() => {
    fetchProgramas({ page: 1, limit: 100 });
    fetchDashboardData({}); // Carga inicial sin filtros
  }, [fetchProgramas, fetchDashboardData]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters({ [key]: value || undefined });
  };

  // "Hasta" incluye el día completo seleccionado
  const handleDateChange = (key: 'startDate' | 'endDate', value: string) => {
    if (!value) return handleFilterChange(key, '');
    const [y, m, d] = value.split('-').map(Number);
    const date =
      key === 'startDate' ? new Date(y!, m! - 1, d!, 0, 0, 0) : new Date(y!, m! - 1, d!, 23, 59, 59, 999);
    handleFilterChange(key, date.toISOString());
  };

  const toDateInput = (iso?: string) => {
    if (!iso) return '';
    const date = new Date(iso);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const hasFilters = Object.values(filters).some(Boolean);

  const handleExport = () => {
    const rows: unknown[][] = [
      ['Indicador', 'Valor'],
      ['Total solicitudes', kpis?.totalSolicitudes],
      ['Aspirantes únicos', kpis?.totalAspirantes],
      ['En proceso', kpis?.enProceso],
      ['Admitidos', kpis?.totalAdmitidos],
      ['Rechazados', kpis?.totalRechazados],
      ['Tasa de admisión (%)', kpis?.tasaAdmision],
      ['Matriculados', kpis?.totalMatriculados],
      ['Tasa de conversión (%)', kpis?.tasaConversion],
      ['Ingresos inscripción', kpis?.ingresosInscripcion],
      ['Ingresos matrícula', kpis?.ingresosMatricula],
      ['Promedio ICFES', kpis?.promedioIcfes],
      ['Días promedio hasta matrícula', kpis?.promedioDiasProceso],
      [],
      ['Programa', 'Facultad', 'Jornada', 'Solicitudes', 'En proceso', 'Admitidos', 'Matriculados', 'Rechazados', 'Conversión (%)', 'ICFES promedio', 'Ingresos'],
      ...metricasProgramas.map((p) => [
        p.nombre,
        p.facultad,
        p.jornada,
        p.totalSolicitudes,
        p.enProceso,
        p.admitidos,
        p.matriculados,
        p.rechazados,
        p.tasaConversion,
        p.promedioIcfes,
        p.ingresos,
      ]),
    ];
    // BOM para que Excel respete las tildes
    const csv = '﻿' + rows.map((r) => r.map(toCsvCell).join(';')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `dashboard-admisiones-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (error) {
    return (
      <div className="p-6 text-center text-danger">
        <p>Error al cargar el dashboard: {error}</p>
        <Button variant="outline" className="mt-4" onPress={() => fetchDashboardData(filters)}>
          Reintentar
        </Button>
      </div>
    );
  }

  const variationLabel = kpis?.comparacion === 'periodo_anterior' ? 'vs período anterior' : 'últimos 30 días vs 30 previos';

  return (
    <div className="mx-auto max-w-[1600px] space-y-6 p-6">
      {/* Encabezado y Filtros */}
      <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Panel de Admisiones</h1>
          <p className="mt-1 text-default-500">Métricas en tiempo real del proceso de admisión UNAC.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Select
            aria-label="Programa"
            value={(filters.programaId || 'all') as Key}
            onChange={(key: Key | null) => {
              const selected = key ? String(key) : '';
              handleFilterChange('programaId', selected === 'all' ? '' : selected);
            }}
            className="w-[220px]"
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

          <Input
            type="date"
            aria-label="Desde"
            className="w-[160px]"
            value={toDateInput(filters.startDate)}
            onChange={(e) => handleDateChange('startDate', e.target.value)}
          />
          <span className="text-sm text-default-400">a</span>
          <Input
            type="date"
            aria-label="Hasta"
            className="w-[160px]"
            value={toDateInput(filters.endDate)}
            onChange={(e) => handleDateChange('endDate', e.target.value)}
          />

          {hasFilters && (
            <Button size="sm" variant="ghost" onPress={() => fetchDashboardData({})}>
              <FilterX className="h-4 w-4" />
              Limpiar
            </Button>
          )}
          <Button
            isIconOnly
            size="sm"
            variant="outline"
            aria-label="Actualizar"
            onPress={() => fetchDashboardData(filters)}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button size="sm" onPress={handleExport} isDisabled={!kpis}>
            <Download className="h-4 w-4" />
            Exportar CSV
          </Button>
        </div>
      </div>

      {isLoading && !kpis ? (
        <div className="flex h-64 items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className={`space-y-6 transition-opacity ${isLoading ? 'opacity-60' : ''}`}>
          {/* KPIs Principales */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <KPICard
              title="Total Solicitudes"
              value={kpis?.totalSolicitudes ?? 0}
              icon={Users}
              iconClassName="bg-blue-500/10 text-blue-600"
              variation={kpis?.variacionSolicitudes}
              variationLabel={variationLabel}
              detail={`${kpis?.totalAspirantes ?? 0} aspirantes · ${kpis?.enProceso ?? 0} en proceso`}
            />
            <KPICard
              title="Tasa de Conversión"
              value={kpis?.tasaConversion ?? 0}
              suffix="%"
              icon={TrendingUp}
              iconClassName="bg-emerald-500/10 text-emerald-600"
              variation={kpis?.variacionConversion}
              variationUnit="pp"
              variationLabel={variationLabel}
              detail={`${kpis?.totalMatriculados ?? 0} matriculados de ${kpis?.totalSolicitudes ?? 0}`}
            />
            <KPICard
              title="Tasa de Admisión"
              value={kpis?.tasaAdmision ?? 0}
              suffix="%"
              icon={UserCheck}
              iconClassName="bg-purple-500/10 text-purple-600"
              detail={`${kpis?.totalAdmitidos ?? 0} admitidos · ${kpis?.totalRechazados ?? 0} rechazados`}
            />
            <KPICard
              title="Ingresos"
              value={formatCurrencyCompact(kpis?.ingresosTotales)}
              icon={DollarSign}
              iconClassName="bg-amber-500/10 text-amber-600"
              variation={kpis?.variacionIngresos}
              variationLabel={variationLabel}
              detail={`Inscripción ${formatCurrency(kpis?.ingresosInscripcion)} · Matrícula ${formatCurrency(kpis?.ingresosMatricula)}`}
            />
          </div>

          {/* Indicadores secundarios */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
            <StatTile
              icon={Hourglass}
              label="En proceso"
              value={kpis?.enProceso ?? 0}
              hint="Solicitudes sin decisión final"
            />
            <StatTile
              icon={GraduationCap}
              label="Promedio ICFES"
              value={kpis?.promedioIcfes ?? '—'}
              hint="De solicitudes con puntaje"
            />
            <StatTile
              icon={Clock}
              label="Días hasta matrícula"
              value={kpis?.promedioDiasProceso ?? '—'}
              hint="Promedio desde la solicitud"
            />
            <StatTile
              icon={CalendarCheck}
              label="Entrevistas"
              value={`${kpis?.entrevistasRealizadas ?? 0} / ${(kpis?.entrevistasRealizadas ?? 0) + (kpis?.entrevistasPendientes ?? 0)}`}
              hint={`${kpis?.entrevistasPendientes ?? 0} por realizar`}
            />
            <StatTile
              icon={Star}
              label="Rúbrica Capellanía"
              value={kpis?.promedioCapellania != null ? `${kpis.promedioCapellania} / 5` : '—'}
              hint="Promedio de evaluaciones"
            />
            <StatTile
              icon={Star}
              label="Rúbrica Académica"
              value={kpis?.promedioAcademica != null ? `${kpis.promedioAcademica} / 5` : '—'}
              hint="Promedio de evaluaciones"
            />
          </div>

          {/* Embudo de conversión + Alertas */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card className="border border-default-200 lg:col-span-2">
              <Card.Header className="px-6 pt-4 pb-0">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                  <TrendingUp className="h-5 w-5 text-accent" />
                  Embudo de conversión
                </h3>
                <p className="text-sm text-default-500">
                  Cuántas solicitudes alcanzaron cada etapa del proceso (BPMN).
                </p>
              </Card.Header>
              <Card.Content className="px-6 pt-4 pb-6">
                <ConversionFunnel data={conversion} />
              </Card.Content>
            </Card>

            <AlertsPanel alerts={alerts} />
          </div>

          {/* Tendencia + Distribución por estado */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card className="border border-default-200">
              <Card.Header className="flex flex-row items-center justify-between px-6 pt-4 pb-0">
                <h3 className="text-lg font-semibold text-foreground">Tendencia de solicitudes</h3>
                <div className="flex rounded-lg border border-default-200 p-0.5" role="group" aria-label="Agrupar por">
                  {GROUP_BY_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      aria-pressed={trendGroupBy === opt.id}
                      onClick={() => fetchTrends(opt.id)}
                      // Color inline: el preflight de HeroUI anula bg-* en <button>
                      style={
                        trendGroupBy === opt.id
                          ? { backgroundColor: 'var(--accent)', color: 'var(--accent-foreground)' }
                          : undefined
                      }
                      className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                        trendGroupBy === opt.id ? '' : 'text-default-600 hover:bg-default-100'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </Card.Header>
              <Card.Content className="px-4 pt-4 pb-4">
                <TrendsChart data={trends} groupBy={trendGroupBy} />
              </Card.Content>
            </Card>

            <Card className="border border-default-200">
              <Card.Header className="px-6 pt-4 pb-0">
                <h3 className="text-lg font-semibold text-foreground">Distribución por estado actual</h3>
              </Card.Header>
              <Card.Content className="px-4 pt-4 pb-4">
                <FunnelChart data={funnel} />
              </Card.Content>
            </Card>
          </div>

          {/* Métricas por programa + Actividad */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card className="border border-default-200 lg:col-span-2">
              <Card.Header className="px-6 pt-4 pb-0">
                <h3 className="text-lg font-semibold text-foreground">Desempeño por programa</h3>
              </Card.Header>
              <Card.Content className="px-6 pt-2 pb-6">
                <ProgramMetricsTable data={metricasProgramas} />
              </Card.Content>
            </Card>

            <ActivityPanel activity={activity} />
          </div>
        </div>
      )}
    </div>
  );
};
