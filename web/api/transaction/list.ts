'use server'

import api from '../'
import { translateErrorCodeApi } from '@/lib/errorTranslations'

export interface ApiGetTransactionsParams {
    page?: number
    pageSize?: number
    categoryId?: number
    type?: CategoryType
    startDate?: string
    endDate?: string
}

export interface ApiGetTransactionsResponse {
    data: Transaction[]
    total: number
    page: number
    pageSize: number
}

export default async function apiGetTransactions(params: ApiGetTransactionsParams = {}): Promise<ResponseApi<ApiGetTransactionsResponse>> {
    try {
        const { data } = await (await api()).get<ApiGetTransactionsResponse>('/transaction', { params })

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
