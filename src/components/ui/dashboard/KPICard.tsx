import { Card } from '@heroui/react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  /** Clases completas del contenedor del ícono, ej. "bg-blue-500/10 text-blue-600" */
  iconClassName: string;
  /** Variación porcentual (o en puntos si variationUnit = 'pp') */
  variation?: number;
  variationUnit?: '%' | 'pp';
  variationLabel?: string;
  /** Línea de contexto bajo el valor, ej. "12 admitidos · 3 rechazados" */
  detail?: string;
  suffix?: string;
}

export const KPICard = ({
  title,
  value,
  icon: Icon,
  iconClassName,
  variation,
  variationUnit = '%',
  variationLabel = 'vs período anterior',
  detail,
  suffix = '',
}: KPICardProps) => {
  const isPositive = variation !== undefined && variation > 0;
  const isNegative = variation !== undefined && variation < 0;

  return (
    <Card className="border border-default-200 shadow-sm transition-shadow hover:shadow-md">
      <Card.Content className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-medium text-default-500">{title}</p>
            <p className="mt-2 text-3xl font-bold tabular-nums text-foreground">
              {value}
              {suffix}
            </p>
            {detail && <p className="mt-1 truncate text-xs text-default-500">{detail}</p>}
          </div>
          <div className={`shrink-0 rounded-xl p-3 ${iconClassName}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>

        {variation !== undefined && (
          <div className="mt-4 flex items-center gap-1">
            {isPositive && <ArrowUpRight className="h-4 w-4 text-success" />}
            {isNegative && <ArrowDownRight className="h-4 w-4 text-danger" />}
            {!isPositive && !isNegative && <Minus className="h-4 w-4 text-default-400" />}
            <span
              className={`text-sm font-medium ${
                isPositive ? 'text-success' : isNegative ? 'text-danger' : 'text-default-400'
              }`}
            >
              {Math.abs(variation).toFixed(1)}
              {variationUnit === 'pp' ? ' pts' : '%'}
            </span>
            <span className="text-xs text-default-400">{variationLabel}</span>
          </div>
        )}
      </Card.Content>
    </Card>
  );
};

interface StatTileProps {
  label: string;
  value: string | number;
  hint?: string;
  icon: React.ElementType;
}

/** Indicador secundario compacto */
export const StatTile = ({ label, value, hint, icon: Icon }: StatTileProps) => (
  <div className="rounded-xl border border-default-200 bg-background p-4">
    <div className="flex items-center gap-2 text-default-500">
      <Icon className="h-4 w-4" />
      <span className="text-xs font-medium">{label}</span>
    </div>
    <p className="mt-2 text-2xl font-semibold tabular-nums text-foreground">{value}</p>
    {hint && <p className="mt-0.5 text-xs text-default-400">{hint}</p>}
  </div>
);
