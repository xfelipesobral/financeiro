import { getRefreshToken } from '@/lib/storage/authentication'

import { redirect } from 'next/navigation'

export default async function EntrarLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    // Checa o refresh token, não o access token: o access token dura só 1h e some antes da sessão
    // acabar de verdade (30 dias), usar ele aqui mandaria de volta pro login um usuário que só
    // precisava renovar o access token.
    if (await getRefreshToken()) {
        redirect('/painel')
    }

    return children
}
