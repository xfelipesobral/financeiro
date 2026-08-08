'use server'

import { redirect } from 'next/navigation'

import api from '..'
import { deleteRefreshToken, deleteToken, getRefreshToken } from '@/lib/storage/authentication'

export default async function logout() {
    const refreshToken = await getRefreshToken()

    if (refreshToken) {
        try {
            await (await api()).delete('/user/login', { data: { refreshToken } })
        } catch {
            // Mesmo se a API falhar (ex.: sessão já revogada), garante que os cookies locais saem —
            // não faz sentido deixar o usuário "preso" logado no navegador por causa disso.
        }
    }

    await deleteToken()
    await deleteRefreshToken()

    redirect('/entrar')
}
