"use client"

import { LandingNavbar } from "@/components/landing/LandingNavbar"
import { LandingFooter } from "@/components/landing/LandingFooter"
import { Mail, MessageSquare, Clock } from "lucide-react"
import { useState } from "react"

const contactMethods = [
    {
        icon: Mail,
        title: "Email",
        description: "For general inquiries and support",
        value: "support@redprowler.com",
        href: "mailto:support@redprowler.com",
    },
    {
        icon: MessageSquare,
        title: "Twitter / X",
        description: "Quick questions and updates",
        value: "@redprowler",
        href: "https://x.com",
    },
    {
        icon: Clock,
        title: "Response Time",
        description: "We typically respond within",
        value: "24 hours",
        href: undefined,
    },
]

export default function ContactPage() {
    const [submitted, setSubmitted] = useState(false)

    return (
        <div className="min-h-screen bg-bg-primary grain">
            <LandingNavbar />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-32 pb-20">
                <div className="text-center mb-16">
                    <h1 className="text-4xl sm:text-5xl font-bold font-[var(--font-display)] tracking-tight mb-4">
                        Get in touch
                    </h1>
                    <p className="text-lg text-text-secondary">
                        Have a question, feedback, or partnership idea? We&apos;d love to hear from you.
                    </p>
                </div>

                <div className="grid lg:grid-cols-5 gap-10">
                    {/* Contact methods */}
                    <div className="lg:col-span-2 space-y-4">
                        {contactMethods.map((method) => (
                            <div key={method.title} className="p-5 rounded-xl border border-border bg-bg-secondary/50">
                                <method.icon className="w-5 h-5 text-accent mb-2" />
                                <h3 className="font-semibold text-text-primary text-sm">{method.title}</h3>
                                <p className="text-xs text-text-tertiary mb-2">{method.description}</p>
                                {method.href ? (
                                    <a
                                        href={method.href}
                                        target={method.href.startsWith("http") ? "_blank" : undefined}
                                        rel={method.href.startsWith("http") ? "noopener noreferrer" : undefined}
                                        className="text-sm text-accent hover:underline"
                                    >
                                        {method.value}
                                    </a>
                                ) : (
                                    <p className="text-sm text-text-primary font-medium">{method.value}</p>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Contact form */}
                    <div className="lg:col-span-3 p-6 rounded-xl border border-border bg-bg-secondary/50">
                        {submitted ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                                    <Mail className="w-6 h-6 text-accent" />
                                </div>
                                <h3 className="text-lg font-semibold text-text-primary mb-2">Message sent!</h3>
                                <p className="text-sm text-text-secondary">
                                    We&apos;ll get back to you within 24 hours.
                                </p>
                            </div>
                        ) : (
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault()
                                    setSubmitted(true)
                                }}
                                className="space-y-5"
                            >
                                <div>
                                    <label className="block text-sm font-medium text-text-primary mb-1.5">Name</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Your name"
                                        className="w-full px-4 py-2.5 rounded-lg bg-bg-tertiary border border-border text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent/50 transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-primary mb-1.5">Email</label>
                                    <input
                                        type="email"
                                        required
                                        placeholder="you@company.com"
                                        className="w-full px-4 py-2.5 rounded-lg bg-bg-tertiary border border-border text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent/50 transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-primary mb-1.5">Subject</label>
                                    <select
                                        className="w-full px-4 py-2.5 rounded-lg bg-bg-tertiary border border-border text-text-primary focus:outline-none focus:border-accent/50 transition-colors"
                                    >
                                        <option value="general">General Inquiry</option>
                                        <option value="support">Technical Support</option>
                                        <option value="billing">Billing Question</option>
                                        <option value="partnership">Partnership</option>
                                        <option value="feedback">Feature Request / Feedback</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-primary mb-1.5">Message</label>
                                    <textarea
                                        required
                                        rows={5}
                                        placeholder="How can we help?"
                                        className="w-full px-4 py-2.5 rounded-lg bg-bg-tertiary border border-border text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent/50 transition-colors resize-none"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full py-2.5 bg-accent text-white font-medium rounded-lg hover:bg-accent/90 transition-colors cursor-pointer"
                                >
                                    Send Message
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </main>

            <LandingFooter />
        </div>
    )
}
