import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import PlusIcon from '@/components/custom/icons/PlusIcon';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-white hover:bg-blue-600 active:bg-blue-700 disabled:opacity-40 disabled:bg-primary',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: [
          'border border-gray-300 rounded-lg font-medium',
          'bg-white text-gray-500',
          'hover:bg-gray-50 hover:text-black',
          'active:bg-gray-100 active:text-black',
          'disabled:bg-white disabled:text-gray-300 disabled:cursor-not-allowed',
        ],
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-14 w-[360px] flex-shrink-0 rounded-lg text-[18px] font-semibold',
        sm: 'h-9 rounded-md px-3',
        md: 'w-[196px] px-[19px] py-3 gap-2.5 rounded-lg text-[16px] font-semibold',
        lg: 'h-11 rounded-md px-8',
        icon: 'w-14 h-14 group-[.expanded]/navbar:w-[196px] group-[.expanded]/navbar:px-[19px] flex-shrink-0 rounded-lg text-[16px] font-semibold',
      },
      hasIcon: {
        true: 'inline-flex items-center',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      hasIcon: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  icon?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, icon = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';

    const content =
      size === 'icon' ? (
        <>
          <PlusIcon />
          {icon && (
            <span className="opacity-0 w-0 group-[.expanded]/navbar:opacity-100 group-[.expanded]/navbar:w-auto group-[.expanded]/navbar:ml-2">
              {children}
            </span>
          )}
        </>
      ) : (
        <>
          {icon && <PlusIcon />}
          {children}
        </>
      );

    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, hasIcon: icon || size === 'icon', className })
        )}
        ref={ref}
        {...props}
      >
        {content}
      </Comp>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
