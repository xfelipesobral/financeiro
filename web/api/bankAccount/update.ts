'use server'

import api from '../'
import { translateErrorCodeApi } from '@/lib/errorTranslations'

export interface ApiUpdateBankAccountParams {
    bankId?: number
    branchCode?: string
    accountNumber?: string
    description?: string
    pixKeys?: { type: string; value: string }[]
}

export default async function apiUpdateBankAccount(id: number | string, params: ApiUpdateBankAccountParams): Promise<ResponseApi<BankAccount>> {
    try {
        const { data } = await (await api()).patch<BankAccount>(`/bank-account/${id}`, params)

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
