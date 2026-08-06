'use server'

import api from '../'
import { getApiErrorMessage } from '@/lib/apiError'

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
            message: getApiErrorMessage(e),
        }
    }
}
