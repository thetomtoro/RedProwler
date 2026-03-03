import { LandingNavbar } from "@/components/landing/LandingNavbar"
import { LandingFooter } from "@/components/landing/LandingFooter"
import { getArticleBySlug, getArticlesByCategory, getAllSlugs, helpCategories } from "@/data/help-articles"
import { ChevronRight, ArrowLeft, ArrowRight } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

export async function generateStaticParams() {
    return getAllSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params
    const article = getArticleBySlug(slug)
    if (!article) return { title: "Article Not Found — RedProwler" }
    return {
        title: `${article.title} — Help Center — RedProwler`,
        description: article.description,
    }
}

export default async function HelpArticlePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const article = getArticleBySlug(slug)
    if (!article) notFound()

    const category = helpCategories.find((c) => c.title === article.category)
    const CategoryIcon = category?.icon

    const siblings = getArticlesByCategory(article.category)
    const currentIndex = siblings.findIndex((a) => a.slug === slug)
    const prevArticle = currentIndex > 0 ? siblings[currentIndex - 1] : null
    const nextArticle = currentIndex < siblings.length - 1 ? siblings[currentIndex + 1] : null

    const relatedArticles = article.relatedSlugs
        .map((s) => getArticleBySlug(s))
        .filter((a): a is NonNullable<typeof a> => a != null)

    return (
        <div className="min-h-screen bg-bg-primary grain">
            <LandingNavbar />

            <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-32 pb-20">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-1.5 text-sm text-text-tertiary mb-8">
                    <Link href="/help" className="hover:text-text-primary transition-colors">
                        Help Center
                    </Link>
                    <ChevronRight className="w-3.5 h-3.5" />
                    <Link href="/help" className="hover:text-text-primary transition-colors">
                        {article.category}
                    </Link>
                    <ChevronRight className="w-3.5 h-3.5" />
                    <span className="text-text-primary">{article.title}</span>
                </nav>

                {/* Header */}
                <div className="mb-12">
                    {CategoryIcon && (
                        <div className="flex items-center gap-2 text-accent text-sm font-medium mb-3">
                            <CategoryIcon className="w-4 h-4" />
                            {article.category}
                        </div>
                    )}
                    <h1 className="text-3xl sm:text-4xl font-bold font-[var(--font-display)] tracking-tight mb-3">
                        {article.title}
                    </h1>
                    <p className="text-lg text-text-secondary">{article.description}</p>
                </div>

                {/* Article body */}
                <div className="space-y-8 text-text-secondary text-[15px] leading-relaxed">
                    {article.sections.map((section, i) => (
                        <section key={i}>
                            {section.heading && (
                                <h2 className="text-lg font-semibold text-text-primary mb-3">
                                    {section.heading}
                                </h2>
                            )}
                            <p className="mb-3">{section.body}</p>
                            {section.list && (
                                <ul className="list-disc pl-6 space-y-1.5 mb-3">
                                    {section.list.map((item, j) => (
                                        <li key={j}>{item}</li>
                                    ))}
                                </ul>
                            )}
                            {section.note && (
                                <div className="p-4 rounded-lg bg-accent/5 border border-accent/15 text-sm">
                                    <span className="text-accent font-medium">Note: </span>
                                    <span className="text-text-secondary">{section.note}</span>
                                </div>
                            )}
                        </section>
                    ))}
                </div>

                {/* Prev / Next navigation */}
                {(prevArticle || nextArticle) && (
                    <div className="flex items-stretch gap-4 mt-16">
                        {prevArticle ? (
                            <Link
                                href={`/help/${prevArticle.slug}`}
                                className="flex-1 p-4 rounded-xl border border-border hover:border-border-hover transition-colors group"
                            >
                                <span className="text-xs text-text-tertiary flex items-center gap-1 mb-1">
                                    <ArrowLeft className="w-3 h-3" /> Previous
                                </span>
                                <span className="text-sm font-medium text-text-primary group-hover:text-accent transition-colors">
                                    {prevArticle.title}
                                </span>
                            </Link>
                        ) : (
                            <div className="flex-1" />
                        )}
                        {nextArticle ? (
                            <Link
                                href={`/help/${nextArticle.slug}`}
                                className="flex-1 p-4 rounded-xl border border-border hover:border-border-hover transition-colors text-right group"
                            >
                                <span className="text-xs text-text-tertiary flex items-center justify-end gap-1 mb-1">
                                    Next <ArrowRight className="w-3 h-3" />
                                </span>
                                <span className="text-sm font-medium text-text-primary group-hover:text-accent transition-colors">
                                    {nextArticle.title}
                                </span>
                            </Link>
                        ) : (
                            <div className="flex-1" />
                        )}
                    </div>
                )}

                {/* Related articles */}
                {relatedArticles.length > 0 && (
                    <div className="mt-12">
                        <h3 className="text-sm font-semibold text-text-tertiary uppercase tracking-wider mb-4">
                            Related articles
                        </h3>
                        <div className="grid sm:grid-cols-3 gap-3">
                            {relatedArticles.map((related) => (
                                <Link
                                    key={related.slug}
                                    href={`/help/${related.slug}`}
                                    className="p-4 rounded-xl border border-border bg-bg-secondary/50 hover:border-border-hover transition-colors"
                                >
                                    <span className="text-xs text-accent font-medium">{related.category}</span>
                                    <p className="text-sm font-medium text-text-primary mt-1">{related.title}</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Contact CTA */}
                <div className="mt-16 text-center p-8 rounded-xl border border-border bg-bg-secondary/50">
                    <h2 className="text-xl font-bold font-[var(--font-display)] mb-3">
                        Still need help?
                    </h2>
                    <p className="text-text-secondary text-sm mb-5">
                        Reach out and we&apos;ll get back to you within 24 hours.
                    </p>
                    <a
                        href="/contact"
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-accent text-white font-medium rounded-lg hover:bg-accent/90 transition-colors"
                    >
                        Contact Support
                    </a>
                </div>
            </main>

            <LandingFooter />
        </div>
    )
}
