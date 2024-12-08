import * as React from 'react';
import { TbPlaystationTriangle, TbVolume, TbWaveSquare } from 'react-icons/tb';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export const UNIT_SOUND_STATUS_TYPES = {
  SPEED: 'unit_speed',
  VOLUME: 'unit_volume',
  PITCH: 'unit_pitch',
} as const;

export type UnitStatusType = (typeof UNIT_SOUND_STATUS_TYPES)[keyof typeof UNIT_SOUND_STATUS_TYPES];

interface SoundStatusProps extends React.HTMLAttributes<HTMLDivElement> {
  type: UnitStatusType;
  value: number;
  showLabel?: boolean;
}

export const STATUS_CONFIGS = {
  [UNIT_SOUND_STATUS_TYPES.SPEED]: {
    icon: TbPlaystationTriangle,
    unit: 'x',
    label: '속도',
    rotation: 90,
  },
  [UNIT_SOUND_STATUS_TYPES.VOLUME]: { icon: TbVolume, unit: ' dB', label: '볼륨', rotation: 0 },
  [UNIT_SOUND_STATUS_TYPES.PITCH]: { icon: TbWaveSquare, unit: '', label: '피치', rotation: 0 },
} as const;

const SoundStatus = React.forwardRef<HTMLDivElement, SoundStatusProps>(
  ({ className, type, value, showLabel = false, ...props }, ref) => {
    const { icon: Icon, unit, label, rotation } = STATUS_CONFIGS[type];

    return (
      <Badge
        ref={ref}
        variant="default"
        className={cn('flex items-center gap-2 h-7', className)}
        {...props}
      >
        <Icon
          className="w-4.5 h-4.5 text-purple-900 flex-shrink-0"
          style={{ transform: `rotate(${rotation}deg)` }}
        />
        <span className="text-sm text-purple-900">
          {showLabel ? `${label} ` : ''}
          {value.toFixed(1)}
          {unit}
        </span>
      </Badge>
    );
  }
);

SoundStatus.displayName = 'SoundStatus';

export { SoundStatus };
