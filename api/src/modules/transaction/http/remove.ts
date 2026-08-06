import { FastifyReply, FastifyRequest } from 'fastify'
import { ApiError, handleApiError } from '../../../utils/error'
import { transaction } from '../service'

export async function remove(request: FastifyRequest, reply: FastifyReply) {
    try {
        const { transactionId } = request.params as { transactionId?: string }

        if (!transactionId) {
            throw new ApiError('TRANSACTION_ID_REQUIRED', 'Lançamento é obrigatório', 400)
        }

        const id = Number(transactionId)

        if (isNaN(id)) {
            throw new ApiError('INVALID_TRANSACTION_ID', 'Lançamento inválido', 400)
        }

        const currentTransaction = await transaction.userFindById(request.authenticated!.userId, id)

        if (!currentTransaction) {
            throw new ApiError('TRANSACTION_NOT_FOUND', 'Lançamento não encontrado', 404)
        }

        await transaction.deleteById(id)

        reply.status(204).send()
    } catch (error) {
        handleApiError(error, reply)
    }
}
