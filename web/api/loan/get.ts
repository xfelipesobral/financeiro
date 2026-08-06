'use server'

import api from '../'
import { translateErrorCodeApi } from '@/lib/errorTranslations'

export default async function apiGetLoan(id: number | string): Promise<ResponseApi<Loan>> {
    try {
        const { data } = await (await api()).get<Loan>(`/loan/${id}`)

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
