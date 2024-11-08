import { AlignJustify, LayoutGrid } from 'lucide-react';
import React from 'react';

import { cn } from '@/lib/utils';

interface ViewButtonProps {
  label: React.ReactNode;
  isSelected: boolean;
  onClick: () => void;
  position: 'left' | 'right';
  ariaLabel: string;
}

interface ViewButtonGroupProps {
  isListView: boolean;
  onViewChange: (isListView: boolean) => void;
}

const ViewButton: React.FC<ViewButtonProps> = ({
  label,
  isSelected,
  onClick,
  position,
  ariaLabel,
}) => {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className={cn(
        'flex items-center justify-center p-1.5 transition-colors border w-7 h-6',
        position === 'left' ? 'rounded-l-full' : 'rounded-r-full',
        isSelected ? 'bg-blue-50 border-blue-600 text-blue-600' : 'border-gray-300'
      )}
    >
      {label}
    </button>
  );
};

const ViewButtonGroup: React.FC<ViewButtonGroupProps> = ({ isListView, onViewChange }) => {
  return (
    <div className="flex rounded-full border-blue-500">
      <ViewButton
        label={<AlignJustify />}
        isSelected={isListView}
        onClick={() => onViewChange(true)}
        position="left"
        ariaLabel="list"
      />
      <ViewButton
        label={<LayoutGrid />}
        isSelected={!isListView}
        onClick={() => onViewChange(false)}
        position="right"
        ariaLabel="grid"
      />
    </div>
  );
};

export default ViewButtonGroup;
