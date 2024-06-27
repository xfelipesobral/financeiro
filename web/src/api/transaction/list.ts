'use server'

import api from '..'

interface filters {
    initialDate?: string
    finalDate?: string
    bankId?: string
    categoryId?: string
    type?: 'CREDIT' | 'DEBIT'
    page?: string
    limit?: string
}

export async function transactionsList(filters: filters): Promise<Transaction[]> {
    try {
        const { data } = await api().get<Transaction[]>('/transaction', { params: filters })
        return data
    } catch (e) {
        console.log('*ERROR transactionsList: ', e)
        return []
    }
}