import { cookies } from 'next/headers'

export function deleteRefreshToken() {
    return cookies().delete('id')
}

export function writeRefreshToken(token: string) {
    return cookies().set('id', token, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60, // 1 mes
        sameSite: 'strict',
        path: '/',
        secure: process.env.NODE_ENV !== 'development'
    })
}

export function getRefreshToken() {
    return cookies().get('id')?.value
}

export function deleteToken() {
    return cookies().delete('token')
}

export function writeToken(token: string) {
    return cookies().set('token', token, {
        httpOnly: true,
        maxAge: 1 * 60 * 60, // 1 hora
        sameSite: 'strict',
        path: '/',
        secure: process.env.NODE_ENV !== 'development'
    })
}

export function getToken() {
    return cookies().get('token')?.value
}