import { Sidebar } from "@/components/layout/Sidebar"
import { Navbar } from "@/components/layout/Navbar"
import { MobileNav } from "@/components/layout/MobileNav"
import { QueryProvider } from "@/components/providers/QueryProvider"

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <QueryProvider>
            <div className="flex h-screen bg-bg-primary">
                <Sidebar />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <Navbar />
                    <main className="flex-1 overflow-y-auto p-6 pb-20 lg:pb-6">
                        {children}
                    </main>
                </div>
                <MobileNav />
            </div>
        </QueryProvider>
    )
}
