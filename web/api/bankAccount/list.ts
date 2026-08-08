'use server'

import api from '../'
import { getApiErrorMessage } from '@/lib/apiError'

export interface ApiGetBankAccountsParams {
    // Pula o cálculo de saldo (custoso: varre todas as transações do usuário) quando a tela só
    // precisa da lista de contas, ex.: selects de formulário.
    includeBalance?: boolean
}

export default async function apiGetBankAccounts(params: ApiGetBankAccountsParams = {}): Promise<ResponseApi<BankAccount[]>> {
    try {
        const { data } = await (await api()).get<BankAccount[]>('/bank-account', { params })

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
