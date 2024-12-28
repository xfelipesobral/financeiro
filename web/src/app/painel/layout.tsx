import { redirect } from 'next/navigation'

import { getToken } from '@/lib/storage/authentication'

import WebNav from '@/components/painel/nav'

import Container from './container'

export default function LayoutPainel({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    if (!getToken()) {
        redirect('/entrar')
    }

    return (
        <div className='flex min-h-screen w-full flex-col bg-gray-100'>
            <aside className='fixed inset-y-0 left-0 z-10 hidden w-14 flex-col sm:flex'>
                <WebNav />
            </aside>
            <div className='flex flex-col sm:gap-4 p-2 sm:pl-14 flex-1'>
                <main className='flex bg-white border shadow-sm rounded-xl flex-col flex-1 gap-4 p-5 md:gap-8 lg:grid-cols-3 xl:grid-cols-3'>
                    {children}
                </main>
            </div>
        </div>
    )
}

