import { FastifyReply, FastifyRequest } from 'fastify'
import { ApiError, handleApiError } from '../../../utils/error'
import { loan } from '../service'
import { formatLoan } from '../functions/formatLoan'

export async function get(request: FastifyRequest, reply: FastifyReply) {
    try {
        const { loanId } = request.params as { loanId?: string }

        if (!loanId) {
            throw new ApiError('LOAN_ID_REQUIRED', 'Empréstimo é obrigatório', 400)
        }

        const id = Number(loanId)

        if (isNaN(id)) {
            throw new ApiError('INVALID_LOAN_ID', 'Empréstimo inválido', 400)
        }

        const currentLoan = await loan.userFindById(request.authenticated!.userId, id)

        if (!currentLoan) {
            throw new ApiError('LOAN_NOT_FOUND', 'Empréstimo não encontrado', 404)
        }

        reply.status(200).send(formatLoan(currentLoan))
    } catch (error) {
        handleApiError(error, reply)
    }
}
