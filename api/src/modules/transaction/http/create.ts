import { FastifyReply, FastifyRequest } from 'fastify'
import { handleApiError } from '../../../utils/error'
import { createTransaction, CreateTransactionDTO } from '../functions/createTransaction'
import { formatTransaction } from '../functions/formatTransaction'

export async function create(request: FastifyRequest<{ Body: CreateTransactionDTO }>, reply: FastifyReply) {
    try {
        const createdTransaction = await createTransaction(request.authenticated!.userId, request.body)

        reply.status(201).send(formatTransaction(createdTransaction))
    } catch (error) {
        handleApiError(error, reply)
    }
}
