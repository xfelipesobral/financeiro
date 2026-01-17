'use server'

import api from '..'

export async function getBankAccount(guid: string): Promise<BankAccount | null> {
    try {
        const { data } = await (await api()).get<BankAccount>(`/bankAccount/${guid}`)
        return data
    } catch (e) {
        return null
    }
}
