import { ReactNode } from 'react'
import { redirect } from 'next/navigation'

import { getRefreshToken } from '@/lib/storage/authentication'
import PainelContainer from './container'

export default async function PainelLayout({ children }: { children: ReactNode }) {
    // Antes disso, nada impedia um visitante sem sessão de abrir /painel — a tela renderia normal e
    // só os fetches falhariam com toast de erro. Checa o refresh token (não o access token, que dura
    // só 1h e é renovado nos bastidores pelo interceptor em web/api/index.ts).
    if (!(await getRefreshToken())) {
        redirect('/entrar')
    }

    return <PainelContainer>{children}</PainelContainer>
}
