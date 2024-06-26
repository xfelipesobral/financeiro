'use server'

import api from '../'

interface Login {
    accessToken: string
    refreshToken: string
}

interface LoginError {
    response: {
        data: {
            message: string
        }
    }
}

const errorTranslations: { [key: string]: string } = {
    'Invalid email or password': 'Email ou senha inválidos',
    'Email and password are required': 'Email e senha são obrigatórios'
}

export default async function login(email: string, password: string) {
    try {
        const { data } = await api().post<Login>('/user/login', { email, password })

        

        return data
    } catch (e) {
        const { response: { data: { message } } } = e as LoginError
        return errorTranslations[message] || 'Erro inesperado, tente novamente mais tarde'
    }
}