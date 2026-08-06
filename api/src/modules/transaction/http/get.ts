import { FastifyReply, FastifyRequest } from 'fastify'
import { ApiError, handleApiError } from '../../../utils/error'
import { transaction } from '../service'
import { formatTransaction } from '../functions/formatTransaction'

export async function get(request: FastifyRequest, reply: FastifyReply) {
    try {
        const { transactionId } = request.params as { transactionId?: string }

        if (!transactionId) {
            throw new ApiError('TRANSACTION_ID_REQUIRED', 'Transaction ID is required.', 400)
        }

        const id = Number(transactionId)

        if (isNaN(id)) {
            throw new ApiError('INVALID_TRANSACTION_ID', 'Transaction ID must be a valid number.', 400)
        }

        const currentTransaction = await transaction.userFindById(request.authenticated!.userId, id)

        if (!currentTransaction) {
            throw new ApiError('TRANSACTION_NOT_FOUND', 'Transaction not found.', 404)
        }

        reply.status(200).send(formatTransaction(currentTransaction))
    } catch (error) {
        handleApiError(error, reply)
    }
}
