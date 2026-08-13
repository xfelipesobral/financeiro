import { FastifyReply, FastifyRequest } from 'fastify'
import { ApiError, handleApiError } from '../../../utils/error'
import { updateTransaction, UpdateTransactionDTO } from '../functions/updateTransaction'

export async function update(request: FastifyRequest<{ Body: UpdateTransactionDTO }>, reply: FastifyReply) {
    try {
        const { transactionId } = request.params as { transactionId?: string }

        if (!transactionId) {
            throw new ApiError('TRANSACTION_ID_REQUIRED', 'Lançamento é obrigatório', 400)
        }

        const id = Number(transactionId)

        if (isNaN(id)) {
            throw new ApiError('INVALID_TRANSACTION_ID', 'Lançamento inválido', 400)
        }

        await updateTransaction(request.authenticated!.userId, id, request.body)

        reply.status(200).send({ id })
    } catch (error) {
        handleApiError(error, reply)
    }
}
