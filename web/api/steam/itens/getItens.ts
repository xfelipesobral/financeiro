'use server'

import api from '../../'
import { translateErrorCodeApi } from '@/lib/errorTranslations'

export interface ApiSteamInventoryItem {
    id: number
    name: string
    description: string
    marketUrl: string
    imageUrl: string
    color: string
    quantity: number
    lastPaidPrice: number | null
    lastSoldPrice: number | null
    lastPrice: number
    averagePaidPrice: number
    averageSoldPrice: number
    quantityBought: number
    quantitySold: number
}

export default async function apiGetSteamItens(): Promise<ResponseApi<ApiSteamInventoryItem[]>> {
    try {
        const { data } = await (await api()).get<ApiSteamInventoryItem[]>('/steam/itens')

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
