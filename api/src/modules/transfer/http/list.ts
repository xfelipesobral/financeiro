import { FastifyReply, FastifyRequest } from 'fastify'
import { handleApiError } from '../../../utils/error'
import { transfer } from '../service'
import { formatTransfer } from '../functions/formatTransfer'

export async function list(request: FastifyRequest, reply: FastifyReply) {
    try {
        const transfers = await transfer.userFindMany(request.authenticated!.userId)

        reply.status(200).send(transfers.map(formatTransfer))
    } catch (error) {
        handleApiError(error, reply)
    }
}
