import * as React from 'react';
import { TbMinus, TbPlus } from 'react-icons/tb';

import { Slider } from '@/components/ui/slider';

interface StateControllerProps {
  label: string;
  value: number;
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (value: number) => void;
  onIncrease?: () => void;
  onDecrease?: () => void;
}

const formatValue = (value: number, unit: string) => {
  if (unit === '%') {
    return Math.round(value);
  }
  return value.toFixed(1);
};

const StateController = React.forwardRef<HTMLDivElement, StateControllerProps>(
  (
    { label, value, unit = '', min = 0, max = 100, step = 1, onChange, onIncrease, onDecrease },
    ref
  ) => {
    const handleSliderChange = (newValue: number[]) => {
      onChange?.(newValue[0]);
    };

    const handleDecrease = () => {
      const newValue = Math.max(min, value - step);
      onChange?.(Number(newValue.toFixed(1)));
      onDecrease?.();
    };

    const handleIncrease = () => {
      const newValue = Math.min(max, value + step);
      onChange?.(Number(newValue.toFixed(1)));
      onIncrease?.();
    };

    const formattedValue = formatValue(value, unit);

    return (
      <div ref={ref} className="w-full space-y-1">
        <span className="text-sm font-bold">{label}</span>
        <div className="flex items-center gap-2">
          <div className="relative flex grow items-center">
            <Slider
              value={[value]}
              min={min}
              max={max}
              step={step}
              onValueChange={handleSliderChange}
            />
          </div>
          <div className="flex items-center gap-1 rounded-md bg-gray-50 px-2 py-1">
            <button
              onClick={handleDecrease}
              className="text-gray-600 hover:text-gray-900 pr-1 border-r border-gray-400"
              disabled={value <= min}
            >
              <TbMinus className="h-4 w-4" />
            </button>
            <div className="min-w-[30px] text-center text-sm">
              {formattedValue}
              {unit}
            </div>
            <button
              onClick={handleIncrease}
              className="text-gray-600 hover:text-gray-900 pl-1 border-l border-gray-400"
              disabled={value >= max}
            >
              <TbPlus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }
);

StateController.displayName = 'StateController';

export { StateController };
