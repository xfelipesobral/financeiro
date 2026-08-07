'use server'

import api from '../'
import { getApiErrorMessage } from '@/lib/apiError'

export interface ApiPayPaymentParams {
    paidAt?: string
}

export default async function apiPayPayment(id: number | string, params?: ApiPayPaymentParams): Promise<ResponseApi<Payment>> {
    try {
        const { data } = await (await api()).patch<Payment>(`/payment/${id}/pay`, params)

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
