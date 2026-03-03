import { cn } from "@/lib/utils"
import { InputHTMLAttributes, forwardRef } from "react"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, id, ...props }, ref) => {
        return (
            <div className="flex flex-col gap-1.5">
                {label && (
                    <label htmlFor={id} className="text-sm font-medium text-text-secondary">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    id={id}
                    className={cn(
                        "h-10 px-3 rounded-lg bg-bg-tertiary border border-border text-text-primary text-sm placeholder:text-text-tertiary",
                        "focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent",
                        "transition-all duration-150",
                        error && "border-error focus:ring-error/50 focus:border-error",
                        className
                    )}
                    {...props}
                />
                {error && (
                    <p className="text-xs text-error">{error}</p>
                )}
            </div>
        )
    }
)
Input.displayName = "Input"
