'use server'

import api from '../'
import { getApiErrorMessage } from '@/lib/apiError'

export default async function apiPayPayment(id: number | string): Promise<ResponseApi<Payment>> {
    try {
        const { data } = await (await api()).patch<Payment>(`/payment/${id}/pay`)

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
