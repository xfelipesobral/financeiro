import WebNav from '@/components/painel/nav'

export default function Container({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {

    return (
        <div className='flex min-h-screen w-full flex-col bg-muted/40'>
            <aside className='fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex'>
                <WebNav />
            </aside>
            <div className='flex flex-col sm:gap-4 sm:py-4 sm:pl-14'>
                <main className='flex flex-col flex-1 gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3'>
                    {children}
                </main>
            </div>
        </div>
    )
}