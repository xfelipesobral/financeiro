'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    ArrowLeftRight,
    CircleDollarSign,
    CreditCard,
    DollarSign,
    Gamepad2,
    HandCoins,
    Landmark,
    LayoutDashboard,
    Tags,
    type LucideIcon,
} from 'lucide-react'

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from '@/components/ui/sidebar'

interface NavItem {
    title: string
    url: string
    icon: LucideIcon
}

interface NavGroup {
    label: string
    items: NavItem[]
}

// Agrupado por finalidade (não por ordem alfabética): visão geral primeiro, cadastros que alimentam
// os lançamentos depois, e o inventário Steam por último por ser um módulo à parte do financeiro.
// Exportado (em vez de ficar só local) porque o breadcrumb do header (container.tsx) reaproveita os
// mesmos títulos, pra não duplicar rótulo de página em dois lugares.
export const navGroups: NavGroup[] = [
    {
        label: 'Visão geral',
        items: [
            { title: 'Painel', url: '/painel', icon: LayoutDashboard },
            { title: 'Contas a Pagar', url: '/painel/contas-a-pagar', icon: CircleDollarSign },
            { title: 'Lançamentos', url: '/painel/transacoes', icon: ArrowLeftRight },
            { title: 'Inventário Steam', url: '/painel/inventario-steam', icon: Gamepad2 },
        ],
    },
    {
        label: 'Cadastros',
        items: [
            { title: 'Categorias', url: '/painel/categorias', icon: Tags },
            { title: 'Contas', url: '/painel/contas', icon: Landmark },
            { title: 'Cartões', url: '/painel/cartoes', icon: CreditCard },
            { title: 'Empréstimos', url: '/painel/emprestimos', icon: HandCoins },
        ],
    },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const pathname = usePathname()

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/painel">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                    <DollarSign size={18} />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-bold">Financeiro</span>
                                    <span className="truncate text-xs text-sidebar-foreground/70">Controle financeiro pessoal</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                {navGroups.map((group) => (
                    <SidebarGroup key={group.label}>
                        <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {group.items.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild isActive={pathname === item.url} tooltip={item.title}>
                                            <Link href={item.url}>
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    )
}
