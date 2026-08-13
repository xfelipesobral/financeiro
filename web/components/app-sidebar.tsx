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
    LogOut,
    Tags,
    type LucideIcon,
} from 'lucide-react'

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from '@/components/ui/sidebar'
import logout from '@/api/user/logout'
import { useUsuarioLogado } from '@/app/painel/usuarioLogadoContext'

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
    const { usuario, loading: loadingUsuario } = useUsuarioLogado()

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/painel" prefetch={false}>
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
                                            <Link href={item.url} prefetch={false}>
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
            <SidebarFooter>
                <SidebarMenu>
                    {(usuario || loadingUsuario) && (
                        <SidebarMenuItem>
                            <div className="flex flex-col px-2 py-1 text-sm leading-tight group-data-[collapsible=icon]:hidden">
                                {loadingUsuario ? (
                                    <span className="text-muted-foreground">Carregando...</span>
                                ) : (
                                    <>
                                        <span className="truncate font-medium">
                                            {usuario!.firstName} {usuario!.lastName}
                                        </span>
                                        <span className="truncate text-xs text-muted-foreground">{usuario!.email}</span>
                                    </>
                                )}
                            </div>
                        </SidebarMenuItem>
                    )}
                    <SidebarMenuItem>
                        <form action={logout}>
                            <SidebarMenuButton type="submit" tooltip="Sair">
                                <LogOut />
                                <span>Sair</span>
                            </SidebarMenuButton>
                        </form>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
