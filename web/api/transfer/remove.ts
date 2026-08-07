'use server'

import api from '../'
import { getApiErrorMessage } from '@/lib/apiError'

export default async function apiRemoveTransfer(id: number | string): Promise<ResponseApi<null>> {
    try {
        await (await api()).delete(`/transfer/${id}`)

        return {
            success: true,
        }
    } catch (e) {
        return {
            success: false,
            message: getApiErrorMessage(e),
        }
    }
}
