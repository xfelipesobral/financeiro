'use server'

import api from '../../'
import { getApiErrorMessage } from '@/lib/apiError'

export interface ApiCreateSteamInventoryItemParams {
    name: string
    marketHashName: string
    imageUrl: string
    initialPaidPrice?: number | null
}

export interface ApiCreateSteamInventoryItemResponse {
    id: number
}

export default async function apiCreateSteamInventoryItem(
    item: ApiCreateSteamInventoryItemParams,
): Promise<ResponseApi<ApiCreateSteamInventoryItemResponse>> {
    try {
        const { data, status } = await (await api()).post<ApiCreateSteamInventoryItemResponse>('/steam/itens', item)

        if (status !== 201) {
            throw new Error('UNKNOWN_ERROR')
        }

        return {
            success: true,
            data,
        }
    } catch (e) {
        console.log(e)
        return {
            success: false,
            message: getApiErrorMessage(e),
        }
    }
}
