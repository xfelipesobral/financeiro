'use server'

import api from '../../'
import { translateErrorCodeApi } from '@/lib/errorTranslations'

export interface ApiSteamInventoryItemDetails {
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
}

export default async function apiGetSteamItem(itemId: string): Promise<ResponseApi<ApiSteamInventoryItemDetails>> {
    try {
        const { data } = await (await api()).get<ApiSteamInventoryItemDetails>(`/steam/itens/${itemId}`)

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
