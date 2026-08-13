'use server'

import api from '../'
import { getApiErrorMessage } from '@/lib/apiError'

export interface ApiUpdateLoanParams {
    description?: string
    dueDay?: number
    interestRate?: number | null
}

export default async function apiUpdateLoan(id: number | string, params: ApiUpdateLoanParams): Promise<ResponseApi<{ id: number }>> {
    try {
        const { data } = await (await api()).patch<{ id: number }>(`/loan/${id}`, params)

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
