'use server'

import api from '../../'
import { translateErrorCodeApi } from '@/lib/errorTranslations'

export interface ApiSteamItemTransaction {
    id?: number
    observation?: string
    type: 'BOUGHT' | 'SOLD'
    quantity: number
    unitPrice: number
}

export default async function apiSaveSteamItemTransaction(itemId: number, transaction: ApiSteamItemTransaction): Promise<ResponseApi<void>> {
    try {
        const { status } = await (await api()).post(`/steam/transactions/${itemId}`, transaction)

        if (status !== 200 && status !== 201) {
            throw new Error('Não foi possível salvar a transação do item Steam. Por favor, tente novamente.')
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
