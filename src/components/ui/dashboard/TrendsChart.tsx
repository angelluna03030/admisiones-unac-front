import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { TrendData, TrendGroupBy } from '../../../types/Dashboard';

interface TrendsChartProps {
  data: TrendData[];
  groupBy: TrendGroupBy;
}

// Paleta categórica validada (orden fijo: azul, naranja, aqua)
const SERIES = [
  { key: 'total_solicitudes', label: 'Solicitudes', color: '#2a78d6' },
  { key: 'admitidos', label: 'Admitidos', color: '#eb6834' },
  { key: 'matriculados', label: 'Matriculados', color: '#1baf7a' },
] as const;

const formatPeriod = (value: string, groupBy: TrendGroupBy) => {
  const date = new Date(value);
  if (groupBy === 'month') {
    return date.toLocaleDateString('es-CO', { month: 'short', year: '2-digit', timeZone: 'UTC' });
  }
  return date.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', timeZone: 'UTC' });
};

export const TrendsChart = ({ data, groupBy }: TrendsChartProps) => {
  if (data.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-sm text-default-400">
        Sin datos para el período seleccionado.
      </div>
    );
  }

  const chartData = data.map((d) => ({ ...d, periodo: formatPeriod(d.period, groupBy) }));

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 8, right: 16, left: -8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
          <XAxis dataKey="periodo" tick={{ fontSize: 12, fill: '#71717a' }} tickLine={false} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#71717a' }} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
          {SERIES.map((s) => (
            <Line
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.label}
              stroke={s.color}
              strokeWidth={2}
              dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
              activeDot={{ r: 5 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
