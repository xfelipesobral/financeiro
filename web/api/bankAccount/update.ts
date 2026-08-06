'use server'

import api from '../'
import { getApiErrorMessage } from '@/lib/apiError'

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
            message: getApiErrorMessage(e),
        }
    }
}
