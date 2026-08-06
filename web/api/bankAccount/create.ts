'use server'

import api from '../'
import { translateErrorCodeApi } from '@/lib/errorTranslations'

export interface ApiCreateBankAccountParams {
    bankId: number
    branchCode: string
    accountNumber: string
    description?: string
    pixKeys?: { type: string; value: string }[]
}

export default async function apiCreateBankAccount(params: ApiCreateBankAccountParams): Promise<ResponseApi<BankAccount>> {
    try {
        const { data, status } = await (await api()).post<BankAccount>('/bank-account', params)

        if (status !== 201) {
            throw new Error('UNKNOWN_ERROR')
        }

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
