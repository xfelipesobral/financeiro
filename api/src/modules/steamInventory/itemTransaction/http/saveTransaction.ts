import { FastifyReply, FastifyRequest } from 'fastify'
import { ApiError, handleApiError } from '../../../../utils/error'
import { steamInventoryItemTransaction } from '../service'
import { CATEGORY_BOUGHT_STEAM_ITEM, CATEGORY_SOLD_STEAM_ITEM } from '../../constants'
import { steamInventoryItem } from '../../item/service'
import { saveTransaction } from '../functions/saveTransaction'

interface Params {
    itemId: string
}

interface Body {
    id?: number
    observation?: string
    type?: string
    quantity?: number
    unitPrice?: number
}

export async function httpSaveTransaction(request: FastifyRequest<{ Params: Params; Body: Body }>, reply: FastifyReply) {
    try {
        const { itemId } = request.params
        const { id, observation, type, quantity, unitPrice } = request.body

        const transaction = await saveTransaction({
            itemId: Number(itemId),
            categoryId: type === 'BOUGHT' ? CATEGORY_BOUGHT_STEAM_ITEM : CATEGORY_SOLD_STEAM_ITEM,
            quantity: quantity || 0,
            unitPrice: unitPrice || 0,
            observation,
            id,
            findLastPrice: false,
            userId: request.authenticated!.userId,
        })

        reply.status(id ? 200 : 201).send({
            message: id ? 'Transaction updated successfully.' : 'Transaction created successfully.',
            id: transaction.id,
        })
    } catch (error) {
        handleApiError(error, reply)
    }
}
