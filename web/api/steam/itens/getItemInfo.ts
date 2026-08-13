'use server'

import api from '../../'
import { getApiErrorMessage } from '@/lib/apiError'

export interface ApiGetSteamItemInfoResponse {
    name: string
    marketName: string
    imageUrl: string
    marketUrl: string
}

export default async function apiGetSteamItemInfo(marketUrl: string): Promise<ResponseApi<ApiGetSteamItemInfoResponse>> {
    try {
        const { data, status } = await (await api()).post<ApiGetSteamItemInfoResponse>('/steam/itens/cs-item-info', { marketUrl })

        if (status !== 200) {
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
