import type { ReactNode } from 'react';
import { cn } from "../../utils/cn";


interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-xl font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
        {
          'bg-primary-600 text-white hover:bg-primary-700 shadow-sm': variant === 'primary',
          'bg-accent-500 text-white hover:bg-accent-600 shadow-sm': variant === 'secondary',
          'border-2 border-primary-200 bg-transparent hover:bg-primary-50 text-primary-700': variant === 'outline',
          'hover:bg-primary-50 text-primary-600': variant === 'ghost',
          'h-9 px-4 text-sm': size === 'sm',
          'h-11 px-6 text-base': size === 'md',
          'h-14 px-8 text-lg rounded-2xl': size === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
