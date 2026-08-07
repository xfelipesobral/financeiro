import { FastifyReply, FastifyRequest } from 'fastify'
import { ApiError, handleApiError } from '../../../utils/error'
import { removeTransfer } from '../functions/removeTransfer'

export async function remove(request: FastifyRequest, reply: FastifyReply) {
    try {
        const { transferId } = request.params as { transferId?: string }

        if (!transferId) {
            throw new ApiError('TRANSFER_ID_REQUIRED', 'Transferência é obrigatória', 400)
        }

        const id = Number(transferId)

        if (isNaN(id)) {
            throw new ApiError('INVALID_TRANSFER_ID', 'Transferência inválida', 400)
        }

        await removeTransfer(request.authenticated!.userId, id)

        reply.status(204).send()
    } catch (error) {
        handleApiError(error, reply)
    }
}
