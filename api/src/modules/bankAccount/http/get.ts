import { FastifyReply, FastifyRequest } from 'fastify'
import { ApiError, handleApiError } from '../../../utils/error'
import { bankAccount } from '../service'

export async function get(request: FastifyRequest, reply: FastifyReply) {
    try {
        const { bankAccountId } = request.params as { bankAccountId?: string }

        if (!bankAccountId) {
            throw new ApiError('BANK_ACCOUNT_ID_REQUIRED', 'Conta bancária é obrigatória', 400)
        }

        const id = Number(bankAccountId)

        if (isNaN(id)) {
            throw new ApiError('INVALID_BANK_ACCOUNT_ID', 'Conta bancária inválida', 400)
        }

        const currentBankAccount = await bankAccount.userFindById(request.authenticated!.userId, id)

        if (!currentBankAccount) {
            throw new ApiError('BANK_ACCOUNT_NOT_FOUND', 'Conta bancária não encontrada', 404)
        }

        reply.status(200).send(currentBankAccount)
    } catch (error) {
        handleApiError(error, reply)
    }
}
