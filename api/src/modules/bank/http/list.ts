import { FastifyReply, FastifyRequest } from 'fastify'
import { handleApiError } from '../../../utils/error'
import { bank } from '../service'

export async function list(request: FastifyRequest, reply: FastifyReply) {
    try {
        const banks = await bank.findMany()

        reply.status(200).send(banks)
    } catch (e) {
        handleApiError(e, reply)
    }
}
