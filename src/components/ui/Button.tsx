import React, { forwardRef } from 'react'

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'ghost' | 'destructive' | 'outline'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', children, ...props }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#00d4ff] disabled:opacity-50 disabled:pointer-events-none'

    const variantClasses = {
      default: 'bg-[#00d4ff] text-[#0a0f1c] hover:bg-[#00b8e6]',
      secondary: 'bg-[#1e293b] text-[#e0e6ed] hover:bg-[#334155]',
      ghost: 'text-[#e0e6ed] hover:bg-[#1e293b]',
      destructive: 'bg-red-600 text-white hover:bg-red-700',
      outline: 'border border-[#334155] bg-transparent text-[#e0e6ed] hover:bg-[#1e293b]',
    }

    const sizeClasses = {
      default: 'h-10 px-4 py-2 text-sm',
      sm: 'h-9 px-3 text-sm',
      lg: 'h-11 px-8 text-base',
      icon: 'h-10 w-10',
    }

    return (
      <button
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'

export default Button