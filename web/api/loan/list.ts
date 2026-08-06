'use server'

import api from '../'
import { getApiErrorMessage } from '@/lib/apiError'

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
            message: getApiErrorMessage(e),
        }
    }
}
