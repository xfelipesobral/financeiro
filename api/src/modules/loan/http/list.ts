import { FastifyReply, FastifyRequest } from 'fastify'
import { handleApiError } from '../../../utils/error'
import { loan } from '../service'
import { formatLoan } from '../functions/formatLoan'

export async function list(request: FastifyRequest, reply: FastifyReply) {
    try {
        const loans = await loan.userFindMany(request.authenticated!.userId)

        reply.status(200).send(loans.map(formatLoan))
    } catch (error) {
        handleApiError(error, reply)
    }
}
