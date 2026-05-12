import React, { forwardRef } from 'react'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={`flex h-10 w-full rounded-md border border-[#334155] bg-[#0a0f1c] px-3 py-2 text-[#e0e6ed] file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#6b7a8f] focus:outline-none focus:ring-2 focus:ring-[#00d4ff] focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export default Input