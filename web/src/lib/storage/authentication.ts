import { cookies } from 'next/headers'

export async function deleteRefreshToken() {
    return (await cookies()).delete('id')
}

export async function writeRefreshToken(token: string) {
    return (await cookies()).set('id', token, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60, // 1 mes
        sameSite: 'strict',
        path: '/',
        secure: process.env.NODE_ENV !== 'development',
    })
}

export async function getRefreshToken() {
    return (await cookies()).get('id')?.value
}

export async function deleteToken() {
    return (await cookies()).delete('token')
}

export async function writeToken(token: string) {
    return (await cookies()).set('token', token, {
        httpOnly: true,
        maxAge: 1 * 60 * 60, // 1 hora
        sameSite: 'strict',
        path: '/',
        secure: process.env.NODE_ENV !== 'development',
    })
}

export async function getToken() {
    return (await cookies()).get('token')?.value
}
