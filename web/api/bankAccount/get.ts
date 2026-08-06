'use server'

import api from '../'
import { translateErrorCodeApi } from '@/lib/errorTranslations'

export default async function apiGetBankAccount(id: number | string): Promise<ResponseApi<BankAccount>> {
    try {
        const { data } = await (await api()).get<BankAccount>(`/bank-account/${id}`)

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
