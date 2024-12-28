'use client'

import { ArrowLeftRight, Landmark, LucideIcon, Wallet } from 'lucide-react'
import Link from 'next/link'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface MenuItemProps {
    now: boolean
    name: string
    Icon: LucideIcon
    href: string
}

function MenuItem({ now, name, Icon, href }: MenuItemProps) {

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Link
                    href={href}
                    className={cn([
                        'flex h-9 w-9 items-center justify-center rounded-lg hover:bg-accent text-muted-foreground hover:text-accent-foreground transition-all md:h-8 md:w-8 duration-500',
                        { 'bg-accent text-accent-foreground': now }
                    ])}
                >
                    <Icon className='h-5 w-5' />
                    <span className='sr-only'>{name}</span>
                </Link>
            </TooltipTrigger>
            <TooltipContent side='right'>{name}</TooltipContent>
        </Tooltip>
    )
}

export default function WebNav() {
    const pathname = usePathname()

    return (
        <div className='flex-1 flex flex-col justify-between'>
            <nav className='flex flex-col items-center gap-4 p-2'>
                <Link
                    href='/painel'
                    className='group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base'
                >
                    <Wallet className='h-4 w-4 transition-all group-hover:scale-110' />
                </Link>

                <MenuItem now={pathname === '/painel/transacoes'} name='Transações' Icon={ArrowLeftRight} href='/painel/transacoes' />
                <MenuItem now={pathname === '/painel/contas'} name='Contas' Icon={Landmark} href='/painel/contas' />
            </nav>
        </div>
    )
}