'use server'

import api from '../../'
import { getApiErrorMessage } from '@/lib/apiError'

export default async function apiDeleteSteamItemTransaction(transactionId: number): Promise<ResponseApi<void>> {
    try {
        const { status } = await (await api()).delete(`/steam/transactions/${transactionId}`)

        if (status !== 200) {
            throw new Error('Não foi possível excluir a transação do item Steam. Por favor, tente novamente.')
        }

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
