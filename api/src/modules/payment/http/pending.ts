import { FastifyReply, FastifyRequest } from 'fastify'
import { handleApiError } from '../../../utils/error'
import { payment } from '../service'

export async function pending(request: FastifyRequest, reply: FastifyReply) {
    try {
        const payments = await payment.userFindManyPending(request.authenticated!.userId)

        reply.status(200).send(payments.map((currentPayment) => ({ ...currentPayment, amount: currentPayment.amount.toNumber() })))
    } catch (error) {
        handleApiError(error, reply)
    }
}
