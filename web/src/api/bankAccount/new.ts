'use server'

import { translateErrorCodeApi } from '@/lib/errorTranslations'
import api from '..'

interface Params {
    bankId?: number
    description?: string
}

export async function banksAccountsNew(params: Params): Promise<Bank | string> {
    try {
        const { data } = await (await api()).post<Bank>('/bankAccount', { ...params })
        return data
    } catch (e) {
        return translateErrorCodeApi(e)
    }
}
