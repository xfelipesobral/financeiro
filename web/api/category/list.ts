'use server'

import api from '../'
import { translateErrorCodeApi } from '@/lib/errorTranslations'

export default async function apiGetCategories(): Promise<ResponseApi<Category[]>> {
    try {
        const { data } = await (await api()).get<Category[]>('/category')

        return {
            success: true,
            data,
        }
    } catch (e) {
        return {
            success: false,
            message: translateErrorCodeApi(e),
        }
    }
}
