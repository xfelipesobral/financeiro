'use server'

import api from '../'
import { getApiErrorMessage } from '@/lib/apiError'

export interface ApiPayCardInvoiceParams {
    bankAccountId: number
    dueDate: string
    paidAt?: string
}

export default async function apiPayCardInvoice(cardId: number | string, params: ApiPayCardInvoiceParams): Promise<ResponseApi<Transaction>> {
    try {
        const { data, status } = await (await api()).post<Transaction>(`/card/${cardId}/pay-invoice`, params)

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
