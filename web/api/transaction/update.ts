'use server'

import api from '../'
import { translateErrorCodeApi } from '@/lib/errorTranslations'

export interface ApiUpdateTransactionParams {
    bankAccountId?: number
    categoryId?: number
    totalAmount?: number
    description?: string
    date?: string
}

export default async function apiUpdateTransaction(id: number | string, params: ApiUpdateTransactionParams): Promise<ResponseApi<Transaction>> {
    try {
        const { data } = await (await api()).patch<Transaction>(`/transaction/${id}`, params)

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
