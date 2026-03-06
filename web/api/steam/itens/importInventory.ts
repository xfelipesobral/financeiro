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
}

export default async function apiImportInventorySteam(steamId: string): Promise<ResponseApi<void>> {
    try {
        const { status } = await (
            await api()
        ).post<{ message: string }>('/steam/itens/inventory-import', {
            steamId,
        })

        if (status !== 200) {
            throw new Error('UNKNOWN_ERROR')
        }

        return {
            success: true,
        }
    } catch (e) {
        return {
            success: false,
            message: translateErrorCodeApi(e),
        }
    }
}
