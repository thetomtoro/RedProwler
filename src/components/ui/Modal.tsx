"use client"

import { cn } from "@/lib/utils"
import { X } from "lucide-react"
import { useEffect, useRef } from "react"

interface ModalProps {
    open: boolean
    onClose: () => void
    children: React.ReactNode
    title?: string
    className?: string
}

export function Modal({ open, onClose, children, title, className }: ModalProps) {
    const overlayRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = ""
        }
        return () => {
            document.body.style.overflow = ""
        }
    }, [open])

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose()
        }
        if (open) window.addEventListener("keydown", handleEsc)
        return () => window.removeEventListener("keydown", handleEsc)
    }, [open, onClose])

    if (!open) return null

    return (
        <div
            ref={overlayRef}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => {
                if (e.target === overlayRef.current) onClose()
            }}
        >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <div
                className={cn(
                    "relative w-full max-w-lg rounded-xl bg-bg-secondary border border-border p-6 animate-fade-in",
                    className
                )}
            >
                {title && (
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
                        <button
                            onClick={onClose}
                            className="text-text-tertiary hover:text-text-primary transition-colors p-1 rounded-md hover:bg-bg-tertiary"
                        >
                            <X size={18} />
                        </button>
                    </div>
                )}
                {children}
            </div>
        </div>
    )
}
