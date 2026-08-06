import { FastifyReply, FastifyRequest } from 'fastify'
import { handleApiError } from '../../../utils/error'
import { createCard, CreateCardDTO } from '../functions/createCard'
import { formatCard } from '../functions/formatCard'

export async function create(request: FastifyRequest<{ Body: CreateCardDTO }>, reply: FastifyReply) {
    try {
        const createdCard = await createCard(request.authenticated!.userId, request.body)

        reply.status(201).send(formatCard(createdCard))
    } catch (error) {
        handleApiError(error, reply)
    }
}
