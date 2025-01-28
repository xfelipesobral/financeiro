'use server'

import api from '..'

interface Params {
    bankId?: number
    description?: string
}

export async function banksAccountsNew(params: Params): Promise<Bank | undefined> {
    try {
        const { data } = await (await api()).post<Bank>('/bank/account/new', { params })
        return data
    } catch (e) {
        return undefined
    }
}
