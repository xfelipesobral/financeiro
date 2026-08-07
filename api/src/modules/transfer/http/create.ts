import { FastifyReply, FastifyRequest } from 'fastify'
import { handleApiError } from '../../../utils/error'
import { createTransfer, CreateTransferDTO } from '../functions/createTransfer'

export async function create(request: FastifyRequest<{ Body: CreateTransferDTO }>, reply: FastifyReply) {
    try {
        const createdTransfer = await createTransfer(request.authenticated!.userId, request.body)

        reply.status(201).send({
            id: createdTransfer.id,
        })
    } catch (error) {
        handleApiError(error, reply)
    }
}
