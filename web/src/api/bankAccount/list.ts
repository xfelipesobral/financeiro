'use server'

import api from '..'

interface Filters {
    id?: string
}

export async function banksAccountsList(filters: Filters): Promise<Bank[]> {
    try {
        const { data } = await (await api()).get<Bank[]>('/bank/account', { params: filters })
        return data
    } catch (e) {
        return []
    }
}
