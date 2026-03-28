import * as React from "react"
import { cn } from "@/utils/cn"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "relative overflow-hidden inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
          {
            "bg-indigo-600 text-white hover:bg-indigo-700 shadow-[0_2px_5px_rgba(0,0,0,0.15)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.2)] active:shadow-[0_1px_2px_rgba(0,0,0,0.15)]": variant === "default",
            "border border-indigo-200 bg-white hover:bg-indigo-50 text-indigo-600 active:bg-indigo-100": variant === "outline",
            "hover:bg-indigo-100 hover:text-indigo-900 active:bg-indigo-200": variant === "ghost",
            "text-indigo-600 underline-offset-4 hover:underline": variant === "link",
            "h-12 px-6 py-2": size === "default",
            "h-9 rounded-md px-3": size === "sm",
            "h-14 rounded-2xl px-8 text-lg": size === "lg",
            "h-10 w-10": size === "icon",
          },
          // Custom ripple effect hack using pseudo-element
          "after:content-[''] after:absolute after:inset-0 after:rounded-inherit after:bg-black/10 after:opacity-0 hover:after:opacity-0 active:after:opacity-100 after:transition-opacity",
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
