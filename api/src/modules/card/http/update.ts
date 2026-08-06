import { FastifyReply, FastifyRequest } from 'fastify'
import { ApiError, handleApiError } from '../../../utils/error'
import { updateCard, UpdateCardDTO } from '../functions/updateCard'
import { formatCard } from '../functions/formatCard'

export async function update(request: FastifyRequest<{ Body: UpdateCardDTO }>, reply: FastifyReply) {
    try {
        const { cardId } = request.params as { cardId?: string }

        if (!cardId) {
            throw new ApiError('CARD_ID_REQUIRED', 'Cartão é obrigatório', 400)
        }

        const id = Number(cardId)

        if (isNaN(id)) {
            throw new ApiError('INVALID_CARD_ID', 'Cartão inválido', 400)
        }

        const updatedCard = await updateCard(request.authenticated!.userId, id, request.body)

        reply.status(200).send(formatCard(updatedCard))
    } catch (error) {
        handleApiError(error, reply)
    }
}
