import { getToken } from '@/lib/storage/authentication'

import { redirect } from 'next/navigation'

export default async function EntrarLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    if (await getToken()) {
        redirect('/painel')
    }

    return children
}
