import { FastifyReply, FastifyRequest } from 'fastify'
import { ApiError, handleApiError } from '../../../utils/error'
import { card } from '../service'
import { formatCard } from '../functions/formatCard'

export async function get(request: FastifyRequest, reply: FastifyReply) {
    try {
        const { cardId } = request.params as { cardId?: string }

        if (!cardId) {
            throw new ApiError('CARD_ID_REQUIRED', 'Cartão é obrigatório', 400)
        }

        const id = Number(cardId)

        if (isNaN(id)) {
            throw new ApiError('INVALID_CARD_ID', 'Cartão inválido', 400)
        }

        const currentCard = await card.userFindById(request.authenticated!.userId, id)

        if (!currentCard) {
            throw new ApiError('CARD_NOT_FOUND', 'Cartão não encontrado', 404)
        }

        reply.status(200).send(formatCard(currentCard))
    } catch (error) {
        handleApiError(error, reply)
    }
}
