'use client'

import { Fragment } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

import { AppSidebar, navGroups } from '@/components/app-sidebar'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'

const pageTitleByUrl = new Map(navGroups.flatMap((group) => group.items).map((item) => [item.url, item.title]))

interface Params {
    children: ReactNode
}

export default function PainelContainer({ children }: Params) {
    const pathname = usePathname()
    const segments = pathname.split('/').filter(Boolean)

    const crumbs = segments.map((seg, i) => {
        const href = '/' + segments.slice(0, i + 1).join('/')

        return {
            href,
            label: pageTitleByUrl.get(href) ?? seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, ' '),
        }
    })

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="sticky z-50 top-0 flex h-16 shrink-0 items-center gap-2 border-b bg-background/90 backdrop-blur-sm px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 data-vertical:h-4" />
                    <Breadcrumb>
                        <BreadcrumbList>
                            {crumbs.map((crumb, i) => (
                                <Fragment key={crumb.href}>
                                    <BreadcrumbItem>
                                        {i === crumbs.length - 1 ? (
                                            <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                                        ) : (
                                            <BreadcrumbLink render={<Link href={crumb.href} />}>{crumb.label}</BreadcrumbLink>
                                        )}
                                    </BreadcrumbItem>
                                    {i < crumbs.length - 1 && <BreadcrumbSeparator />}
                                </Fragment>
                            ))}
                        </BreadcrumbList>
                    </Breadcrumb>
                </header>
                <div className="flex flex-1 flex-col gap-4">{children}</div>
            </SidebarInset>
        </SidebarProvider>
    )
}
