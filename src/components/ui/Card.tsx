import { cn } from "@/lib/utils"

interface CardProps {
    children: React.ReactNode
    className?: string
    hover?: boolean
    glow?: boolean
}

export function Card({ children, className, hover = false, glow = false }: CardProps) {
    return (
        <div
            className={cn(
                "rounded-xl bg-bg-secondary border border-border p-6",
                hover && "transition-all duration-200 hover:border-border-hover hover:bg-bg-tertiary",
                glow && "glow-accent",
                className
            )}
        >
            {children}
        </div>
    )
}
