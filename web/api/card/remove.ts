'use server'

import api from '../'
import { translateErrorCodeApi } from '@/lib/errorTranslations'

export default async function apiRemoveCard(id: number | string): Promise<ResponseApi<null>> {
    try {
        await (await api()).delete(`/card/${id}`)

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
