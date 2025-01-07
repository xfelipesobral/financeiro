'use server'

import api from '..'

interface Filters {
    id?: string
}

export async function banksList(filters: Filters): Promise<Bank[]> {
    try {
        const { data } = await (await api()).get<Bank[]>('/bank', { params: filters })
        console.log(data, 'AQUI')
        return data
    } catch (e) {
        console.log(e)
        return []
    }
}

export async function comboBanksList(filters: Filters): Promise<ComboboxItem[]> {
    const list = await banksList(filters)
    return list.map((bank) => ({ value: bank.id.toString(), label: bank.name }))
}
