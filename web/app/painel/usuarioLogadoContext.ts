import { createContext, useContext } from 'react'
import { ApiGetMeResponse } from '@/api/user/me'

export interface UsuarioLogado extends ApiGetMeResponse {}

export interface UsuarioLogadoContextValue {
    usuario: UsuarioLogado | null
    // `usuario === null` sozinho é ambíguo (ainda carregando vs. falhou); os dois juntos deixam
    // explícito pra quem consome.
    loading: boolean
}

export const UsuarioLogadoContext = createContext<UsuarioLogadoContextValue | undefined>(undefined)

export function useUsuarioLogado() {
    const context = useContext(UsuarioLogadoContext)

    if (context === undefined) {
        throw new Error('useUsuarioLogado precisa ser usado dentro de PainelContainer (UsuarioLogadoContext.Provider)')
    }

    return context
}
