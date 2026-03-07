'use server'

import api from '../../'
import { translateErrorCodeApi } from '@/lib/errorTranslations'

export interface ApiSteamItemTransaction {
    id: number
    type: 'BOUGHT' | 'SOLD'
    createdAt: string
    observation: string | null
    quantity: number
    totalAmount: string
    unitPrice: string
    updatedAt: string
}

export default async function apiGetSteamItemTransactions(
    itemId: number,
    limit: number = 10,
    offset: number = 0,
): Promise<ResponseApi<{ transactions: ApiSteamItemTransaction[]; total: number }>> {
    try {
        const { data, headers } = await (await api()).get<ApiSteamItemTransaction[]>(`/steam/transactions/${itemId}`)

        const total = parseInt(headers['x-total-count'] || '0')

        return {
            success: true,
            data: {
                transactions: data,
                total,
            },
        }
    } catch (e) {
        return {
            success: false,
            message: translateErrorCodeApi(e),
        }
    }
}
