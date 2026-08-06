import { FastifyReply, FastifyRequest } from 'fastify'
import { handleApiError } from '../../../utils/error'
import { paymentMethod } from '../service'

export async function list(request: FastifyRequest, reply: FastifyReply) {
    try {
        const paymentMethods = await paymentMethod.findMany()

        reply.status(200).send(paymentMethods)
    } catch (error) {
        handleApiError(error, reply)
    }
}
