import { ReactNode } from 'react'
import { redirect } from 'next/navigation'

import { getRefreshToken } from '@/lib/storage/authentication'
import PainelContainer from './container'

export default async function PainelLayout({ children }: { children: ReactNode }) {
    if (!(await getRefreshToken())) {
        redirect('/entrar')
    }

    return <PainelContainer>{children}</PainelContainer>
}
