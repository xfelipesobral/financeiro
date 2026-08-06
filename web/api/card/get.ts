'use server'

import api from '../'
import { translateErrorCodeApi } from '@/lib/errorTranslations'

export default async function apiGetCard(id: number | string): Promise<ResponseApi<Card>> {
    try {
        const { data } = await (await api()).get<Card>(`/card/${id}`)

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
