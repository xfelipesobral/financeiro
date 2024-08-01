'use client'

import { ArrowLeftRight, ShoppingCart, Wallet } from 'lucide-react'
import Link from 'next/link'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export default function WebNav() {
    const pathname = usePathname()

    return (
        <div className='flex-1 flex flex-col justify-between'>
            <nav className='flex flex-col items-center gap-4 px-2 sm:py-5'>
                <Link
                    href='/painel'
                    className='group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base'
                >
                    <Wallet className='h-4 w-4 transition-all group-hover:scale-110' />
                </Link>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Link
                            href='/painel/transacoes'
                            className={cn([
                                'flex h-9 w-9 items-center justify-center rounded-lg hover:bg-accent text-muted-foreground hover:text-accent-foreground transition-all md:h-8 md:w-8 duration-500',
                                { 'bg-accent text-accent-foreground': pathname === '/painel/transacoes' }
                            ])}
                        >
                            <ArrowLeftRight className='h-5 w-5' />
                            <span className='sr-only'>Transações</span>
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent side='right'>Transações</TooltipContent>
                </Tooltip>
            </nav>
        </div>
    )
}