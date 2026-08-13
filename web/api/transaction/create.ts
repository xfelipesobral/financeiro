'use server'

import api from '../'
import { getApiErrorMessage } from '@/lib/apiError'

export interface ApiCreateTransactionParams {
    categoryId: number
    totalAmount: number
    description: string
    date?: string
    paymentMethodId: number
    bankAccountId?: number
    cardId?: number
    installmentTotal?: number
}

export default async function apiCreateTransaction(params: ApiCreateTransactionParams): Promise<ResponseApi<{ id: string }>> {
    try {
        const { data, status } = await (await api()).post<{ id: string }>('/transaction', params)

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
