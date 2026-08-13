import { FastifyReply, FastifyRequest } from 'fastify'
import { handleApiError } from '../../../utils/error'
import { createTransaction, CreateTransactionDTO } from '../functions/createTransaction'

export async function create(request: FastifyRequest<{ Body: CreateTransactionDTO }>, reply: FastifyReply) {
    try {
        const createdTransactionGuid = await createTransaction(request.authenticated!.userId, request.body)

        reply.status(201).send({
            id: createdTransactionGuid,
        })
    } catch (error) {
        handleApiError(error, reply)
    }
}
