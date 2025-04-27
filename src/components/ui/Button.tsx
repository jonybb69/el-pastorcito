import { cn } from "src/lib/utils"
import { ButtonHTMLAttributes, forwardRef } from "react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost"
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center rounded-2xl px-4 py-2 font-semibold transition-all duration-300 shadow-md"

    const variants = {
      default: "bg-red-600 text-white hover:bg-yellow-500 hover:text-black",
      outline: "border border-white text-white hover:bg-white hover:text-black",
      ghost: "text-white hover:text-yellow-400"
    }

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], className)}
        {...props}
      />
    )
  }
)

Button.displayName = "Button"
