'use server'

import api from '../'
import { getApiErrorMessage } from '@/lib/apiError'

export default async function apiGetPaymentMethods(): Promise<ResponseApi<PaymentMethod[]>> {
    try {
        const { data } = await (await api()).get<PaymentMethod[]>('/payment-method')

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
