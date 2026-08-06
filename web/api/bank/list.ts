'use server'

import api from '../'
import { getApiErrorMessage } from '@/lib/apiError'

export default async function apiGetBanks(): Promise<ResponseApi<Bank[]>> {
    try {
        const { data } = await (await api()).get<Bank[]>('/bank')

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
