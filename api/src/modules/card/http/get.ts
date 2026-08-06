import { FastifyReply, FastifyRequest } from 'fastify'
import { ApiError, handleApiError } from '../../../utils/error'
import { card } from '../service'
import { formatCard } from '../functions/formatCard'

export async function get(request: FastifyRequest, reply: FastifyReply) {
    try {
        const { cardId } = request.params as { cardId?: string }

        if (!cardId) {
            throw new ApiError('CARD_ID_REQUIRED', 'Card ID is required.', 400)
        }

        const id = Number(cardId)

        if (isNaN(id)) {
            throw new ApiError('INVALID_CARD_ID', 'Card ID must be a valid number.', 400)
        }

        const currentCard = await card.userFindById(request.authenticated!.userId, id)

        if (!currentCard) {
            throw new ApiError('CARD_NOT_FOUND', 'Card not found.', 404)
        }

        reply.status(200).send(formatCard(currentCard))
    } catch (error) {
        handleApiError(error, reply)
    }
}
