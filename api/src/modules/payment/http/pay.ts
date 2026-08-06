import { FastifyReply, FastifyRequest } from 'fastify'
import { ApiError, handleApiError } from '../../../utils/error'
import { payPayment } from '../functions/payPayment'

export async function pay(request: FastifyRequest, reply: FastifyReply) {
    try {
        const { paymentId } = request.params as { paymentId?: string }

        if (!paymentId) {
            throw new ApiError('PAYMENT_ID_REQUIRED', 'Payment ID is required.', 400)
        }

        const id = Number(paymentId)

        if (isNaN(id)) {
            throw new ApiError('INVALID_PAYMENT_ID', 'Payment ID must be a valid number.', 400)
        }

        const updatedPayment = await payPayment(request.authenticated!.userId, id)

        reply.status(200).send({ ...updatedPayment, amount: updatedPayment.amount.toNumber() })
    } catch (error) {
        handleApiError(error, reply)
    }
}
