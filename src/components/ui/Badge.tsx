import { cn } from "@/lib/utils"

interface BadgeProps {
    children: React.ReactNode
    variant?: "default" | "accent" | "success" | "warning" | "error" | "ember"
    className?: string
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
    return (
        <span
            className={cn(
                "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium",
                {
                    "bg-bg-quaternary text-text-secondary": variant === "default",
                    "bg-accent-muted text-accent": variant === "accent",
                    "bg-success/10 text-success": variant === "success",
                    "bg-warning/10 text-warning": variant === "warning",
                    "bg-error/10 text-error": variant === "error",
                    "bg-accent-secondary/10 text-accent-secondary": variant === "ember",
                },
                className
            )}
        >
            {children}
        </span>
    )
}
