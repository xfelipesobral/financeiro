import { ReactNode } from 'react'
import PainelContainer from './container'

export default function PainelLayout({ children }: { children: ReactNode }) {
    return <PainelContainer>{children}</PainelContainer>
}
