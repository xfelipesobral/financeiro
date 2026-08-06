'use server'

import api from '../'
import { getApiErrorMessage } from '@/lib/apiError'

export default async function apiRemoveBankAccount(id: number | string): Promise<ResponseApi<null>> {
    try {
        await (await api()).delete(`/bank-account/${id}`)

        return {
            success: true,
        }
    } catch (e) {
        return {
            success: false,
            message: getApiErrorMessage(e),
        }
    }
}
