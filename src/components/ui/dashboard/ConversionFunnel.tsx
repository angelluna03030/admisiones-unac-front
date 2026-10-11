import type { ConversionData } from '../../../types/Dashboard';

interface ConversionFunnelProps {
  data: ConversionData[];
}

/**
 * Embudo acumulado: cada barra muestra cuántas solicitudes alcanzaron la etapa
 * (ancho = % sobre el total) y la tasa de paso desde la etapa anterior.
 */
export const ConversionFunnel = ({ data }: ConversionFunnelProps) => {
  const total = data[0]?.cantidad ?? 0;

  if (total === 0) {
    return (
      <div className="flex h-[280px] items-center justify-center text-sm text-default-400">
        Sin solicitudes en el período seleccionado.
      </div>
    );
  }

  // Mayor caída entre etapas: dónde se pierde más gente
  const cuello = data
    .slice(1)
    .filter((_, i) => data[i]!.cantidad > 0)
    .reduce<ConversionData | null>(
      (min, d) => (!min || d.porcentajeEtapaAnterior < min.porcentajeEtapaAnterior ? d : min),
      null,
    );

  return (
    <div className="space-y-2">
      {data.map((d, index) => (
        <div
          key={d.etapa}
          className="group grid grid-cols-[150px_1fr_110px] items-center gap-3 text-sm"
          title={`${d.etapa}: ${d.cantidad} solicitudes (${d.porcentajeTotal}% del total)`}
        >
          <span className="truncate text-default-600">{d.etapa}</span>
          <div className="h-6 rounded bg-default-100">
            <div
              className="h-6 rounded bg-[#2a78d6] transition-all group-hover:bg-[#1f63b5]"
              style={{ width: `${Math.max(d.porcentajeTotal, d.cantidad > 0 ? 1.5 : 0)}%` }}
            />
          </div>
          <div className="text-right tabular-nums">
            <span className="font-semibold text-foreground">{d.cantidad}</span>
            <span className="ml-1 text-xs text-default-500">
              {index === 0 ? '100%' : `${d.porcentajeEtapaAnterior}% paso`}
            </span>
          </div>
        </div>
      ))}

      {cuello && cuello.porcentajeEtapaAnterior < 100 && (
        <p className="pt-2 text-xs text-default-500">
          Mayor pérdida: hacia <span className="font-medium text-foreground">{cuello.etapa}</span> solo
          avanza el {cuello.porcentajeEtapaAnterior}% de la etapa anterior.
        </p>
      )}
    </div>
  );
};
