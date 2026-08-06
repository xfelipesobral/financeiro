import { FastifyReply, FastifyRequest } from 'fastify'
import { ApiError, handleApiError } from '../../../utils/error'
import { updateLoan, UpdateLoanDTO } from '../functions/updateLoan'
import { formatLoan } from '../functions/formatLoan'

export async function update(request: FastifyRequest<{ Body: UpdateLoanDTO }>, reply: FastifyReply) {
    try {
        const { loanId } = request.params as { loanId?: string }

        if (!loanId) {
            throw new ApiError('LOAN_ID_REQUIRED', 'Loan ID is required.', 400)
        }

        const id = Number(loanId)

        if (isNaN(id)) {
            throw new ApiError('INVALID_LOAN_ID', 'Loan ID must be a valid number.', 400)
        }

        const updatedLoan = await updateLoan(request.authenticated!.userId, id, request.body)

        reply.status(200).send(formatLoan(updatedLoan))
    } catch (error) {
        handleApiError(error, reply)
    }
}
