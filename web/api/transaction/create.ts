'use server'

import api from '../'
import { translateErrorCodeApi } from '@/lib/errorTranslations'

export interface ApiCreateTransactionParams {
    bankAccountId: number
    categoryId: number
    totalAmount: number
    description: string
    date?: string
}

export default async function apiCreateTransaction(params: ApiCreateTransactionParams): Promise<ResponseApi<Transaction>> {
    try {
        const { data, status } = await (await api()).post<Transaction>('/transaction', params)

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
            message: translateErrorCodeApi(e),
        }
    }
}
