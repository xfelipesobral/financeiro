import { FastifyReply, FastifyRequest } from 'fastify'
import { ApiError, handleApiError } from '../../../utils/error'
import { removeLoan } from '../functions/removeLoan'

export async function remove(request: FastifyRequest, reply: FastifyReply) {
    try {
        const { loanId } = request.params as { loanId?: string }

        if (!loanId) {
            throw new ApiError('LOAN_ID_REQUIRED', 'Loan ID is required.', 400)
        }

        const id = Number(loanId)

        if (isNaN(id)) {
            throw new ApiError('INVALID_LOAN_ID', 'Loan ID must be a valid number.', 400)
        }

        await removeLoan(request.authenticated!.userId, id)

        reply.status(204).send()
    } catch (error) {
        handleApiError(error, reply)
    }
}
