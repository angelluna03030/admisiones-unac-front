import { Chip } from '@heroui/react';
import { getEstadoSolicitud } from '../../../types/Solicitud';

export const EstadoSolicitudChip = ({ estado }: { estado: string }) => {
  const info = getEstadoSolicitud(estado);
  return (
    <Chip color={info.color} size="sm" variant="soft">
      {info.label}
    </Chip>
  );
};
