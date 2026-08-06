'use server'

import api from '../'
import { getApiErrorMessage } from '@/lib/apiError'

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
            message: getApiErrorMessage(e),
        }
    }
}
