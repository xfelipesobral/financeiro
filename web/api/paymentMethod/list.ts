'use server'

import api from '../'
import { translateErrorCodeApi } from '@/lib/errorTranslations'

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
            message: translateErrorCodeApi(e),
        }
    }
}
