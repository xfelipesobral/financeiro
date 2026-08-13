'use server'

import api from '..'
import { getApiErrorMessage } from '@/lib/apiError'

export interface ApiGetMeResponse {
    firstName: string
    lastName: string
    email: string
}

export default async function apiGetMe(): Promise<ResponseApi<ApiGetMeResponse>> {
    try {
        const { data } = await (await api()).get<ApiGetMeResponse>('/user/me')

        return {
            success: true,
            data,
        }
    } catch (e) {
        return {
            success: false,
            message: getApiErrorMessage(e),
        }
    }
}
