'use server'

import { writeRefreshToken, writeToken } from '@/lib/storage/authentication'
import api from '..'
import { translateErrorCodeApi } from '@/lib/errorTranslations'

interface Login {
    accessToken: string
    refreshToken: string
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
        return translateErrorCodeApi(e)
    }
}
