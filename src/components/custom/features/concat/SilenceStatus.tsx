import * as React from 'react';
import { TbClockPlus } from 'react-icons/tb';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export const SILENCE_STATUS_TYPES = {
  FRONT_SILENCE: 'front_silence',
  BACK_SILENCE: 'back_silence',
  END_SILENCE: 'end_silence',
} as const;

export type SilenceStatusType = (typeof SILENCE_STATUS_TYPES)[keyof typeof SILENCE_STATUS_TYPES];

interface SilenceStatusProps extends React.HTMLAttributes<HTMLDivElement> {
  type: SilenceStatusType;
  value: number;
  showLabel?: boolean;
}

export const STATUS_CONFIGS = {
  [SILENCE_STATUS_TYPES.FRONT_SILENCE]: { label: '맨 앞', unit: '초' },
  [SILENCE_STATUS_TYPES.BACK_SILENCE]: { label: '맨 뒤', unit: '초' },
  [SILENCE_STATUS_TYPES.END_SILENCE]: { label: '간격', unit: '초' },
} as const;

const SilenceStatus = React.forwardRef<HTMLDivElement, SilenceStatusProps>(
  ({ className, type, value, showLabel = false, ...props }, ref) => {
    const { label, unit } = STATUS_CONFIGS[type];

    return (
      <Badge
        ref={ref}
        variant="default"
        className={cn('flex items-center gap-2 h-7', className)}
        {...props}
      >
        <TbClockPlus className="w-4.5 h-4.5 text-purple-900 flex-shrink-0" />
        <span className="text-sm text-purple-900">
          {showLabel ? `${label} ` : ''}
          {value.toFixed(1)}
          {unit}
        </span>
      </Badge>
    );
  }
);

SilenceStatus.displayName = 'SilenceStatus';

export { SilenceStatus };
