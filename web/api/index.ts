import Axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'

import { deleteRefreshToken, deleteToken, getRefreshToken, getToken, writeToken } from '@/lib/storage/authentication'

const baseURL = process.env.API

// Access token dura só 1h (ver api/src/modules/user/service). Sem isso, qualquer chamada feita
// depois de 1h de login cai direto num 401 e o usuário precisa logar de novo mesmo tendo um
// refresh token (30 dias) válido. Retentativa é feita uma única vez por requisição (`_retry`) pra
// não entrar em loop se o refresh também estiver inválido/expirado.
async function renewAccessToken(): Promise<string | null> {
    const refreshToken = await getRefreshToken()

    if (!refreshToken) return null

    try {
        const { data } = await Axios.patch<{ accessToken: string }>('/user/login', { refreshToken }, { baseURL })

        await writeToken(data.accessToken)

        return data.accessToken
    } catch {
        // Refresh token inválido/expirado/revogado: não tem como renovar, limpa a sessão local.
        await deleteToken()
        await deleteRefreshToken()

        return null
    }
}

export default async function api() {
    const token = await getToken()

    const instance = Axios.create({
        baseURL,
        headers: {
            Authorization: token ? `Bearer ${token}` : '',
        },
    })

    instance.interceptors.response.use(
        (response) => response,
        async (error: AxiosError) => {
            const originalRequest = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined

            const isAuthEndpoint = originalRequest?.url?.includes('/user/login')

            if (error.response?.status !== 401 || !originalRequest || originalRequest._retry || isAuthEndpoint) {
                throw error
            }

            originalRequest._retry = true

            const newAccessToken = await renewAccessToken()

            if (!newAccessToken) throw error

            originalRequest.headers.set('Authorization', `Bearer ${newAccessToken}`)

            return instance.request(originalRequest)
        },
    )

    return instance
}
