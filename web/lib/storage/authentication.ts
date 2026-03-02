import { cookies } from 'next/headers'

export async function deleteRefreshToken() {
    return (await cookies()).delete('financeiro.refresh_token')
}

export async function writeRefreshToken(token: string) {
    return (await cookies()).set('financeiro.refresh_token', token, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60, // 1 mes
        sameSite: 'strict',
        path: '/',
        secure: process.env.NODE_ENV !== 'development',
    })
}

export async function getRefreshToken() {
    return (await cookies()).get('financeiro.refresh_token')?.value
}

export async function deleteToken() {
    return (await cookies()).delete('financeiro.access_token')
}

export async function writeToken(token: string) {
    return (await cookies()).set('financeiro.access_token', token, {
        httpOnly: true,
        maxAge: 1 * 60 * 60, // 1 hora
        sameSite: 'strict',
        path: '/',
        secure: process.env.NODE_ENV !== 'development',
    })
}

export async function getToken() {
    return (await cookies()).get('financeiro.access_token')?.value
}
