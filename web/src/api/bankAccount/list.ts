'use server'

import api from '..'

interface Filters {
    id?: string
}

export async function banksAccountsList(filters?: Filters): Promise<BankAccount[]> {
    try {
        const { data } = await (await api()).get<BankAccount[]>('/bankAccount', { params: filters })
        return data
    } catch (e) {
        return []
    }
}
