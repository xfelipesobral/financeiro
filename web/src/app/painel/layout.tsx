import { redirect } from 'next/navigation'

import { getToken } from '@/lib/storage/authentication'

import Container from './container'

export default function LayoutPainel({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
    if (!getToken()) {
        redirect('/entrar')
    }

    return <Container children={children} />
}

