'use server'

import api from '../'
import { getApiErrorMessage } from '@/lib/apiError'

export interface ApiCreateTransferParams {
    fromBankAccountId: number
    toBankAccountId: number
    amount: number
    description: string
    date?: string
}

export default async function apiCreateTransfer(params: ApiCreateTransferParams): Promise<ResponseApi<{ id: number }>> {
    try {
        const { data, status } = await (await api()).post<{ id: number }>('/transfer', params)

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
