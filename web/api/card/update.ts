'use server'

import api from '../'
import { getApiErrorMessage } from '@/lib/apiError'

export interface ApiUpdateCardParams {
    name?: string
    closingDay?: number
    type?: CardType
    description?: string
    limit?: number
}

export default async function apiUpdateCard(id: number | string, params: ApiUpdateCardParams): Promise<ResponseApi<Card>> {
    try {
        const { data } = await (await api()).patch<Card>(`/card/${id}`, params)

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
