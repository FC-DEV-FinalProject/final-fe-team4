import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const badgeVariants = cva('inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium', {
  variants: {
    variant: {
      default: 'bg-purple-50 text-purple-900 rounded-[20px] px-2 py-[3px] ring-purple-50',
      vc: 'bg-pink-50 text-pink-500 ring-pink-50',
      tts: 'bg-green-50 text-green-500 ring-green-50',
      concat: 'bg-yellow-50 text-yellow-500 ring-yellow-50',
      progress: 'flex items-center text-foreground text-sm font-medium [&>svg]:text-green-500',
      waiting: 'flex items-center text-foreground text-sm font-medium [&>svg]:text-yellow-500',
      failed: 'flex items-center text-foreground text-sm font-medium [&>svg]:text-red-500',
      completed: 'flex items-center text-foreground text-sm font-medium [&>svg]:text-blue-500',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => {
    return <div ref={ref} className={cn(badgeVariants({ variant }), className)} {...props} />;
  }
);

Badge.displayName = 'Badge';

export { Badge, badgeVariants };
