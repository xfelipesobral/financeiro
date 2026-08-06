'use server'

import api from '../'
import { translateErrorCodeApi } from '@/lib/errorTranslations'

export default async function apiGetLoans(): Promise<ResponseApi<Loan[]>> {
    try {
        const { data } = await (await api()).get<Loan[]>('/loan')

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
