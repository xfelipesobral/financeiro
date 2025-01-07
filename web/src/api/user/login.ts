'use server'

import { writeRefreshToken, writeToken } from '@/lib/storage/authentication'

import api from '..'

interface Login {
    accessToken: string
    refreshToken: string
}

const errorTranslations: { [key: string]: string } = {
    'Invalid email or password': 'Email ou senha inválidos',
    'Email and password are required': 'Email e senha são obrigatórios',
}

export default async function login(email: string, password: string): Promise<boolean | string> {
    try {
        const {
            data: { accessToken, refreshToken },
        } = await (await api()).post<Login>('/user/login', { email, password })

        writeRefreshToken(refreshToken)
        writeToken(accessToken)

        return true
    } catch (e) {
        const {
            response: {
                data: { message },
            },
        } = e as ResponseError
        return errorTranslations[message || ''] || 'Erro inesperado, tente novamente mais tarde'
    }
}
