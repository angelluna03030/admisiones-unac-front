import type { ProgramMetric } from '../../../types/Dashboard';
import { formatCurrencyCompact } from '../../../utils/format';

interface ProgramMetricsTableProps {
  data: ProgramMetric[];
}

export const ProgramMetricsTable = ({ data }: ProgramMetricsTableProps) => {
  if (data.length === 0) {
    return <p className="py-8 text-center text-sm text-default-400">Sin solicitudes por programa en el período.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="border-b border-default-200 text-left text-xs text-default-500">
            <th className="py-2 pr-3 font-medium">Programa</th>
            <th className="px-3 py-2 text-right font-medium">Solicitudes</th>
            <th className="px-3 py-2 text-right font-medium">En proceso</th>
            <th className="px-3 py-2 text-right font-medium">Admitidos</th>
            <th className="px-3 py-2 text-right font-medium">Matriculados</th>
            <th className="px-3 py-2 font-medium">Conversión</th>
            <th className="px-3 py-2 text-right font-medium">ICFES prom.</th>
            <th className="py-2 pl-3 text-right font-medium">Ingresos</th>
          </tr>
        </thead>
        <tbody>
          {data.map((p) => (
            <tr key={p.programaId} className="border-b border-default-100 last:border-0 hover:bg-default-50">
              <td className="py-2.5 pr-3">
                <p className="font-medium text-foreground">{p.nombre}</p>
                <p className="text-xs text-default-500">
                  {[p.facultad, p.jornada].filter(Boolean).join(' · ') || p.codigo}
                </p>
              </td>
              <td className="px-3 py-2.5 text-right tabular-nums">{p.totalSolicitudes}</td>
              <td className="px-3 py-2.5 text-right tabular-nums">{p.enProceso}</td>
              <td className="px-3 py-2.5 text-right tabular-nums">{p.admitidos}</td>
              <td className="px-3 py-2.5 text-right tabular-nums">{p.matriculados}</td>
              <td className="px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-16 rounded bg-default-100">
                    <div className="h-1.5 rounded bg-[#1baf7a]" style={{ width: `${p.tasaConversion}%` }} />
                  </div>
                  <span className="tabular-nums text-default-600">{p.tasaConversion}%</span>
                </div>
              </td>
              <td className="px-3 py-2.5 text-right tabular-nums">{p.promedioIcfes ?? '—'}</td>
              <td className="py-2.5 pl-3 text-right tabular-nums">{formatCurrencyCompact(p.ingresos)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
