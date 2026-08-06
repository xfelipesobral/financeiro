'use server'

import api from '../'
import { translateErrorCodeApi } from '@/lib/errorTranslations'

export interface ApiUpdateLoanParams {
    description?: string
    dueDay?: number
    interestRate?: number | null
}

export default async function apiUpdateLoan(id: number | string, params: ApiUpdateLoanParams): Promise<ResponseApi<Loan>> {
    try {
        const { data } = await (await api()).patch<Loan>(`/loan/${id}`, params)

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
