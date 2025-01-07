'use server'

import api from '..'

interface filters {
    initialDate?: string
    finalDate?: string
    bankId?: string
    categoryId?: string
    type?: 'CREDIT' | 'DEBIT'
}

export async function totalTransactions(filters: filters): Promise<TransactionTotals> {
    try {
        const { data } = await (await api()).get<TransactionTotals>('/transaction/total', { params: filters })
        return data
    } catch (e) {
        return {
            balance: 0,
            credit: 0,
            debit: 0,
        }
    }
}
