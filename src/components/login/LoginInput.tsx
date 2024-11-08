import * as React from 'react';

import { cn } from '@/lib/utils';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const LoginInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex w-full rounded-lg border border-gray-100 bg-background px-4 py-3 text-base text-black ring-offset-background placeholder:text-gray-400 focus:outline-none focus:border-primary focus:ring-primary focus:ring-1 disabled:cursor-not-allowed disabled:opacity-40',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
LoginInput.displayName = 'Input';

export { LoginInput };
