import { FastifyReply, FastifyRequest } from 'fastify'
import { ApiError, handleApiError } from '../../../utils/error'
import { payCardInvoice, PayCardInvoiceDTO } from '../functions/payCardInvoice'
import { formatTransaction } from '../../transaction/functions/formatTransaction'

export async function payInvoice(request: FastifyRequest<{ Body: PayCardInvoiceDTO }>, reply: FastifyReply) {
    try {
        const { cardId } = request.params as { cardId?: string }

        if (!cardId) {
            throw new ApiError('CARD_ID_REQUIRED', 'Cartão é obrigatório', 400)
        }

        const id = Number(cardId)

        if (isNaN(id)) {
            throw new ApiError('INVALID_CARD_ID', 'Cartão inválido', 400)
        }

        const createdTransaction = await payCardInvoice(request.authenticated!.userId, id, request.body)

        reply.status(201).send(formatTransaction(createdTransaction))
    } catch (error) {
        handleApiError(error, reply)
    }
}
