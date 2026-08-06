'use server'

import api from '../'
import { translateErrorCodeApi } from '@/lib/errorTranslations'

export default async function apiGetBankAccounts(): Promise<ResponseApi<BankAccount[]>> {
    try {
        const { data } = await (await api()).get<BankAccount[]>('/bank-account')

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
