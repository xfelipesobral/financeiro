import { getToken } from '@/lib/storage/authentication'

import { redirect } from 'next/navigation'

export default function LayoutEntrar({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
    if (getToken()) {
        redirect('/painel')
    }

    return children
}