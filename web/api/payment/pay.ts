'use server'

import api from '../'
import { translateErrorCodeApi } from '@/lib/errorTranslations'

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
            message: translateErrorCodeApi(e),
        }
    }
}
