import { FastifyReply, FastifyRequest } from 'fastify'
import { ApiError, handleApiError } from '../../../../utils/error'
import { steamInventoryItemTransaction } from '../service'
import { CATEGORY_BOUGHT_STEAM_ITEM } from '../../constants'

export async function getItemTransactions(request: FastifyRequest, reply: FastifyReply) {
    try {
        const { itemId } = request.params as { itemId?: string }
        const { limit, offset } = request.query as { limit?: string; offset?: string }

        if (!itemId) {
            throw new ApiError('ITEM_ID_REQUIRED', 'Item ID is required.', 400)
        }

        let numLimit = Number(limit)
        let numOffset = Number(offset)
        let numItemId = Number(itemId)

        if (isNaN(numItemId) || numItemId < 1) {
            throw new ApiError('INVALID_ITEM_ID', 'Item ID must be a positive integer.', 400)
        }

        if (!numLimit || isNaN(numLimit) || numLimit < 1) {
            numLimit = 100
        }

        if (!numOffset || isNaN(numOffset) || numOffset < 0) {
            numOffset = 0
        }

        let totalTransactions = 0
        if (numOffset === 0) {
            totalTransactions = await steamInventoryItemTransaction.userTransactionsCountByItemId(request.authenticated!.userId, numItemId)
        }

        const transactions = await steamInventoryItemTransaction.userTransactionsByItemId(
            request.authenticated!.userId,
            numItemId,
            numLimit,
            numOffset,
        )

        reply.header('X-Total-Count', totalTransactions.toString())

        reply.status(200).send(
            transactions.map(({ id, categoryId, createdAt, observation, quantity, totalAmount, unitPrice, updatedAt }) => ({
                id,
                type: categoryId === CATEGORY_BOUGHT_STEAM_ITEM ? 'BOUGHT' : 'SOLD',
                createdAt,
                observation,
                quantity,
                totalAmount,
                unitPrice,
                updatedAt,
            })),
        )
    } catch (error) {
        handleApiError(error, reply)
    }
}

interface Item {
    id: number
    name: string
    description: string
    marketUrl: string
    imageUrl: string
    color: string
    quantity: number
    lastPaidPrice: number | null
    lastSoldPrice: number | null
    lastPrice: number
}
