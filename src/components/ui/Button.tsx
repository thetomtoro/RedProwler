import { cn } from "@/lib/utils"
import { ButtonHTMLAttributes, forwardRef } from "react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "ghost" | "danger" | "cta"
    size?: "sm" | "md" | "lg"
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
                    {
                        "bg-accent text-white hover:bg-accent-hover hover:shadow-[0_0_24px_rgba(230,57,70,0.25)] active:scale-[0.97]":
                            variant === "primary",
                        "bg-bg-tertiary text-text-primary border border-border hover:bg-bg-quaternary hover:border-border-hover active:scale-[0.98]":
                            variant === "secondary",
                        "text-text-secondary hover:text-text-primary hover:bg-bg-tertiary":
                            variant === "ghost",
                        "bg-error/10 text-error hover:bg-error/20":
                            variant === "danger",
                        "bg-gradient-to-r from-accent to-accent-secondary text-white hover:shadow-[0_0_30px_rgba(230,57,70,0.3),0_0_60px_rgba(255,109,0,0.12)] active:scale-[0.97]":
                            variant === "cta",
                        "text-xs px-3 h-8 gap-1.5": size === "sm",
                        "text-sm px-4 h-10 gap-2": size === "md",
                        "text-base px-6 h-12 gap-2.5 font-semibold": size === "lg",
                    },
                    className
                )}
                {...props}
            >
                {children}
            </button>
        )
    }
)
Button.displayName = "Button"
