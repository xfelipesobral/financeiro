import { FastifyReply, FastifyRequest } from 'fastify'
import { handleApiError } from '../../../utils/error'
import { card } from '../service'
import { formatCard } from '../functions/formatCard'

export async function list(request: FastifyRequest, reply: FastifyReply) {
    try {
        const cards = await card.userFindMany(request.authenticated!.userId)

        reply.status(200).send(cards.map(formatCard))
    } catch (error) {
        handleApiError(error, reply)
    }
}
