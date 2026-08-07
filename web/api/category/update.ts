'use server'

import api from '../'
import { getApiErrorMessage } from '@/lib/apiError'

export interface ApiUpdateCategoryParams {
    description?: string
    type?: CategoryType
    parentId?: number | null
}

export default async function apiUpdateCategory(id: number | string, params: ApiUpdateCategoryParams): Promise<ResponseApi<Category>> {
    try {
        const { data } = await (await api()).patch<Category>(`/category/${id}`, params)

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
