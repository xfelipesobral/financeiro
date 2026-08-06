'use server'

import api from '../'
import { getApiErrorMessage } from '@/lib/apiError'

export interface ApiUpdateTransactionParams {
    categoryId?: number
    totalAmount?: number
    description?: string
    date?: string
    paymentMethodId?: number
    bankAccountId?: number
    cardId?: number
    installmentTotal?: number
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
            message: getApiErrorMessage(e),
        }
    }
}
