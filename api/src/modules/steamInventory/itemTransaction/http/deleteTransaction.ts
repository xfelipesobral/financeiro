import { FastifyReply, FastifyRequest } from 'fastify'
import { handleApiError } from '../../../../utils/error'
import { deleteTransaction } from '../functions/deleteTransaction'

interface Params {
    transactionId: string
}

export async function httpDeleteTransaction(request: FastifyRequest<{ Params: Params }>, reply: FastifyReply) {
    try {
        const { transactionId } = request.params

        const numTransactionId = Number(transactionId)

        await deleteTransaction({ transactionId: numTransactionId, userId: request.authenticated!.userId })

        reply.status(200).send({
            message: 'Transaction deleted successfully.',
        })
    } catch (error) {
        handleApiError(error, reply)
    }
}
