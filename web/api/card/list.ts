'use server'

import api from '../'
import { getApiErrorMessage } from '@/lib/apiError'

export default async function apiGetCards(): Promise<ResponseApi<Card[]>> {
    try {
        const { data } = await (await api()).get<Card[]>('/card')

        return {
            success: true,
            data,
        }
    } catch (e) {
        return {
            success: false,
            message: getApiErrorMessage(e),
        }
    }
}
