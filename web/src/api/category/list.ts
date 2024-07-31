'use server'

import api from '..'

interface Filters {
    id?: string
    type?: CategoryType
}

export async function categoryList(filters: Filters): Promise<Category[]> {
    try {
        const { data } = await api().get<Category[]>('/category', { params: filters })
        return data
    } catch (e) {
        console.log('*ERROR CategoryList: ', e)
        return []
    }
}

export async function comboCategoryList(filters: Filters): Promise<ComboboxItem[]> {
    const list = await categoryList(filters)
    return list.map(category => ({ value: category.id.toString(), label: category.description }))
}