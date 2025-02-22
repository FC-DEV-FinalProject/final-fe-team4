import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { TbCircleCheckFilled, TbCircleXFilled } from 'react-icons/tb';

import { cn } from '@/lib/utils';

const alertVariants = cva(
  'relative w-full rounded-lg p-5 flex items-center gap-3 animate-in fade-in-0 slide-in-from-top-1 duration-300',
  {
    variants: {
      variant: {
        default:
          'bg-green-100/80 text-green-600 [&>svg]:text-green-600 dark:text-green-600 shadow-[0_2px_6px_-1px_rgba(0,128,0,0.3),0_1px_4px_-2px_rgba(0,128,0,0.2)]',
        destructive:
          'text-red-600 [&>svg]:text-red-600 dark:text-red-600 bg-red-100/80 shadow-[0_2px_6px_-1px_rgba(220,38,38,0.3),0_1px_4px_-2px_rgba(220,38,38,0.2)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div ref={ref} role="alert" className={cn(alertVariants({ variant }), className)} {...props}>
    {variant === 'default' && <TbCircleCheckFilled className="h-6 w-6 text-gray-600" />}
    {variant === 'destructive' && <TbCircleXFilled className="h-6 w-6 text-red-600" />}
    {props.children}
  </div>
));
Alert.displayName = 'Alert';

const AlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h5
      ref={ref}
      className={cn('mb-1.5 font-medium leading-none tracking-tight text-base', className)}
      {...props}
    />
  )
);
AlertTitle.displayName = 'AlertTitle';

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('text-base leading-relaxed', className)} {...props} />
));
AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertDescription, AlertTitle };
