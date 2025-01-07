import { getToken } from '@/lib/storage/authentication'

import { redirect } from 'next/navigation'

export default async function LayoutEntrar({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    if (await getToken()) {
        redirect('/painel')
    }

    return children
}
