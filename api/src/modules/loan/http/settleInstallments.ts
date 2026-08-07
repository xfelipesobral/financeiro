import { FastifyReply, FastifyRequest } from 'fastify'
import { ApiError, handleApiError } from '../../../utils/error'
import { settleLoanInstallments, SettleLoanInstallmentsDTO } from '../functions/settleLoanInstallments'
import { formatLoan } from '../functions/formatLoan'

export async function settleInstallments(request: FastifyRequest<{ Body: SettleLoanInstallmentsDTO }>, reply: FastifyReply) {
    try {
        const { loanId } = request.params as { loanId?: string }

        if (!loanId) {
            throw new ApiError('LOAN_ID_REQUIRED', 'Empréstimo é obrigatório', 400)
        }

        const id = Number(loanId)

        if (isNaN(id)) {
            throw new ApiError('INVALID_LOAN_ID', 'Empréstimo inválido', 400)
        }

        const updatedLoan = await settleLoanInstallments(request.authenticated!.userId, id, request.body)

        reply.status(200).send(formatLoan(updatedLoan))
    } catch (error) {
        handleApiError(error, reply)
    }
}
