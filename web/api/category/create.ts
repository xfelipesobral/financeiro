'use server'

import api from '../'
import { getApiErrorMessage } from '@/lib/apiError'

export interface ApiCreateCategoryParams {
    description: string
    type: CategoryType
    parentId?: number | null
}

export default async function apiCreateCategory(params: ApiCreateCategoryParams): Promise<ResponseApi<{ id: number }>> {
    try {
        const { data, status } = await (await api()).post<{ id: number }>('/category', params)

        if (status !== 201) {
            throw new Error('UNKNOWN_ERROR')
        }

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
