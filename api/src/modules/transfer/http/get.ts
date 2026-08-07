import { FastifyReply, FastifyRequest } from 'fastify'
import { ApiError, handleApiError } from '../../../utils/error'
import { transfer } from '../service'
import { formatTransfer } from '../functions/formatTransfer'

export async function get(request: FastifyRequest, reply: FastifyReply) {
    try {
        const { transferId } = request.params as { transferId?: string }

        if (!transferId) {
            throw new ApiError('TRANSFER_ID_REQUIRED', 'Transferência é obrigatória', 400)
        }

        const id = Number(transferId)

        if (isNaN(id)) {
            throw new ApiError('INVALID_TRANSFER_ID', 'Transferência inválida', 400)
        }

        const currentTransfer = await transfer.userFindById(request.authenticated!.userId, id)

        if (!currentTransfer) {
            throw new ApiError('TRANSFER_NOT_FOUND', 'Transferência não encontrada', 404)
        }

        reply.status(200).send(formatTransfer(currentTransfer))
    } catch (error) {
        handleApiError(error, reply)
    }
}
