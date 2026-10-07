import * as React from 'react';
import { TbPlayerPauseFilled, TbPlayerPlayFilled } from 'react-icons/tb';

import { cn } from '@/lib/utils';

interface PlayButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isPlaying?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
}

const PlayButton = React.forwardRef<HTMLButtonElement, PlayButtonProps>(
  ({ className, isPlaying = false, onPlay, onPause, ...props }, ref) => {
    const Icon = isPlaying ? TbPlayerPauseFilled : TbPlayerPlayFilled;

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      if (isPlaying) {
        onPause?.();
      } else {
        onPlay?.();
      }
    };

    return (
      <button
        ref={ref}
        className={cn(
          'flex items-center justify-center',
          'w-8 h-8 rounded-full',
          'bg-blue-900 hover:bg-blue-800',
          'transition-colors duration-200',
          className
        )}
        onClick={handleClick}
        aria-label={isPlaying ? 'Pause' : 'Play'}
        {...props}
      >
        <Icon className="w-1/2 h-1/2 text-white" />
      </button>
    );
  }
);

PlayButton.displayName = 'PlayButton';

export { PlayButton };
