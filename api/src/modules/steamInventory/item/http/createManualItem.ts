import { FastifyReply, FastifyRequest } from 'fastify'
import { handleApiError } from '../../../../utils/error'
import { createManualItem } from '../functions/createManualItem'

interface Body {
    name?: string
    marketHashName?: string
    imageUrl?: string
    initialPaidPrice?: number | null
}

export async function httpCreateManualItem(request: FastifyRequest<{ Body: Body }>, reply: FastifyReply) {
    try {
        const item = await createManualItem(request.authenticated!.userId, request.body)

        reply.status(201).send({
            id: item.id,
        })
    } catch (error) {
        handleApiError(error, reply)
    }
}
