import * as React from 'react';

import { cn } from '@/lib/utils';

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size = 50, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex items-center justify-center', className)}
        role="status"
        aria-label="Loading"
        {...props}
      >
        <div
          className={cn(
            'animate-spin rounded-full',
            'bg-[conic-gradient(from_0deg,#3A74FE_0%,rgba(58,116,254,0)_100%)]',
            '[mask-image:radial-gradient(circle,transparent_60%,white_61%)]',
            '[-webkit-mask-image:radial-gradient(circle,transparent_60%,white_61%)]'
          )}
          style={{
            width: size,
            height: size,
          }}
        />
      </div>
    );
  }
);

Spinner.displayName = 'Spinner';

export { Spinner };
