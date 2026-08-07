'use server'

import api from '../'
import { getApiErrorMessage } from '@/lib/apiError'

export interface ApiSettleLoanInstallmentsParams {
    installments: { paymentId: number; paidAt?: string }[]
}

export default async function apiSettleLoanInstallments(
    id: number | string,
    params: ApiSettleLoanInstallmentsParams,
): Promise<ResponseApi<Loan>> {
    try {
        const { data } = await (await api()).patch<Loan>(`/loan/${id}/settle-installments`, params)

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
