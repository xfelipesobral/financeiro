import { FastifyReply, FastifyRequest } from 'fastify'
import { ApiError, handleApiError } from '../../../utils/error'
import { acceptScheduledPayment, AcceptScheduledPaymentDTO } from '../functions/acceptScheduledPayment'

export async function pay(request: FastifyRequest<{ Body: AcceptScheduledPaymentDTO }>, reply: FastifyReply) {
    try {
        const { paymentId } = request.params as { paymentId?: string }

        if (!paymentId) {
            throw new ApiError('PAYMENT_ID_REQUIRED', 'Parcela é obrigatória', 400)
        }

        const id = Number(paymentId)

        if (isNaN(id)) {
            throw new ApiError('INVALID_PAYMENT_ID', 'Parcela inválida', 400)
        }

        const updatedPayment = await acceptScheduledPayment(request.authenticated!.userId, id, request.body)

        reply.status(200).send({ ...updatedPayment, amount: updatedPayment.amount.toNumber() })
    } catch (error) {
        handleApiError(error, reply)
    }
}
