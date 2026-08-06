'use server'

import api from '../'
import { translateErrorCodeApi } from '@/lib/errorTranslations'

export interface ApiCreateLoanParams {
    bankAccountId: number
    description: string
    totalAmount: number
    installmentTotal?: number
    dueDay: number
    interestRate?: number | null
    desiredMonthlyPayment?: number | null
    startDate?: string
}

export default async function apiCreateLoan(params: ApiCreateLoanParams): Promise<ResponseApi<Loan>> {
    try {
        const { data, status } = await (await api()).post<Loan>('/loan', params)

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
