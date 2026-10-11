import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { FunnelData } from '../../../types/Dashboard';
import { getEstadoSolicitud } from '../../../types/Solicitud';

interface FunnelChartProps {
  data: FunnelData[];
}

// Una sola serie → un solo tono (el color no codifica nada adicional)
const BAR_COLOR = '#2a78d6';

/** Distribución de solicitudes por su estado actual */
export const FunnelChart = ({ data }: FunnelChartProps) => {
  // Se ocultan los estados vacíos para que el gráfico se lea limpio
  const chartData = data
    .filter((d) => d.cantidad > 0)
    .map((d) => ({ ...d, label: getEstadoSolicitud(d.estado).label }));

  if (chartData.length === 0) {
    return (
      <div className="flex h-[320px] items-center justify-center text-sm text-default-400">
        Sin solicitudes en el período seleccionado.
      </div>
    );
  }

  return (
    <div className="w-full" style={{ height: Math.max(220, chartData.length * 40 + 40) }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} layout="vertical" margin={{ top: 8, right: 32, left: 8, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e4e4e7" />
          <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12, fill: '#71717a' }} />
          <YAxis
            type="category"
            dataKey="label"
            tick={{ fontSize: 12, fill: '#52525b' }}
            width={170}
          />
          <Tooltip
            cursor={{ fill: 'rgba(0,0,0,0.04)' }}
            formatter={(value) => [value, 'Solicitudes']}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Bar
            dataKey="cantidad"
            fill={BAR_COLOR}
            radius={[0, 4, 4, 0]}
            barSize={20}
            label={{ position: 'right', fontSize: 12, fill: '#52525b' }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
