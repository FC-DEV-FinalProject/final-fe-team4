import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { TbCircleCheckFilled, TbCircleXFilled } from 'react-icons/tb';

import { cn } from '@/lib/utils';

const alertVariants = cva('relative w-full rounded-lg border p-4 flex items-center gap-2', {
  variants: {
    variant: {
      default:
        'bg-green-50 text-green-600 border-green-600/50 [&>svg]:text-green-600 dark:text-green-600 dark:border-green-900/50 dark:dark:border-green-900',
      destructive:
        'border-red-500/50 text-red-600 dark:border-red-500 [&>svg]:text-red-600 dark:text-red-600 dark:border-red-900/50 dark:dark:border-red-900 bg-red-50',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div ref={ref} role="alert" className={cn(alertVariants({ variant }), className)} {...props}>
    {variant === 'default' && <TbCircleCheckFilled className="h-5 w-5 text-gray-600" />}
    {variant === 'destructive' && <TbCircleXFilled className="h-5 w-5 text-red-600" />}
    {props.children}
  </div>
));
Alert.displayName = 'Alert';

const AlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h5
      ref={ref}
      className={cn('mb-1 font-medium leading-none tracking-tight', className)}
      {...props}
    />
  )
);
AlertTitle.displayName = 'AlertTitle';

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('text-sm [&_p]:leading-relaxed', className)} {...props} />
));
AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertDescription, AlertTitle };
