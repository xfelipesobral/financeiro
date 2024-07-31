import { Wallet } from 'lucide-react'
import Link from 'next/link'

export default function WebNav() {

    return (
        <div className='flex-1 flex flex-col justify-between'>
            <nav className='flex flex-col items-center gap-4 px-2 sm:py-5'>
                <Link
                    href='/painel'
                    className='group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base'
                >
                    <Wallet className='h-4 w-4 transition-all group-hover:scale-110' />
                </Link>
            </nav>
            <nav className='mt-auto flex flex-col items-center gap-4 px-2 sm:py-5'>
            </nav>
        </div>
    )
}