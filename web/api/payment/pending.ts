'use server'

import api from '../'
import { getApiErrorMessage } from '@/lib/apiError'

export default async function apiGetPendingPayments(): Promise<ResponseApi<PendingPayment[]>> {
    try {
        const { data } = await (await api()).get<PendingPayment[]>('/payment/pending')

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
