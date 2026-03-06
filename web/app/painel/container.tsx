'use client'

import { AppSidebar } from '@/components/app-sidebar'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

interface Params {
    children: ReactNode
}

export default function PainelContainer({ children }: Params) {
    const pathname = usePathname()
    const segments = pathname.split('/').filter(Boolean)

    const crumbs = segments.map((seg, i) => ({
        label: seg.charAt(0).toUpperCase() + seg.slice(1),
        href: '/' + segments.slice(0, i + 1).join('/'),
    }))

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="sticky z-90 top-0 flex h-16 shrink-0 items-center gap-2 border-b bg-background/90 backdrop-blur-sm px-4">
                    <SidebarTrigger className="-ml-1" />
                    {crumbs.map((crumb, i) => (
                        <span key={crumb.href}>
                            {' / '}
                            {i === crumbs.length - 1 ? <span>{crumb.label}</span> : <Link href={crumb.href}>{crumb.label}</Link>}
                        </span>
                    ))}
                </header>
                <div className="flex flex-1 flex-col gap-4">{children}</div>
            </SidebarInset>
        </SidebarProvider>
    )
}
