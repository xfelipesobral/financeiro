'use server'

import api from '../'
import { translateErrorCodeApi } from '@/lib/errorTranslations'

export default async function apiRemoveLoan(id: number | string): Promise<ResponseApi<null>> {
    try {
        await (await api()).delete(`/loan/${id}`)

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
