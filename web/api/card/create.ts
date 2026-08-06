'use server'

import api from '../'
import { getApiErrorMessage } from '@/lib/apiError'

export interface ApiCreateCardParams {
    bankAccountId: number
    name: string
    closingDay: number
    type: CardType
    description: string
    limit: number
}

export default async function apiCreateCard(params: ApiCreateCardParams): Promise<ResponseApi<Card>> {
    try {
        const { data, status } = await (await api()).post<Card>('/card', params)

        if (status !== 201) {
            throw new Error('UNKNOWN_ERROR')
        }

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
