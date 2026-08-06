import { FastifyReply, FastifyRequest } from 'fastify'
import { ApiError, handleApiError } from '../../../utils/error'
import { bankAccount } from '../service'
import { card } from '../../card/service'
import { transaction } from '../../transaction/service'

export async function remove(request: FastifyRequest, reply: FastifyReply) {
    try {
        const { bankAccountId } = request.params as { bankAccountId?: string }

        if (!bankAccountId) {
            throw new ApiError('BANK_ACCOUNT_ID_REQUIRED', 'Bank account ID is required.', 400)
        }

        const id = Number(bankAccountId)

        if (isNaN(id)) {
            throw new ApiError('INVALID_BANK_ACCOUNT_ID', 'Bank account ID must be a valid number.', 400)
        }

        const currentBankAccount = await bankAccount.userFindById(request.authenticated!.userId, id)

        if (!currentBankAccount) {
            throw new ApiError('BANK_ACCOUNT_NOT_FOUND', 'Bank account not found.', 404)
        }

        // Regra de negócio explícita: não há onDelete em cascata no schema, então a conta só
        // pode ser removida se não houver cartões ou lançamentos vinculados a ela.
        const [cardsCount, transactionsCount] = await Promise.all([card.countByBankAccountId(id), transaction.countByBankAccountId(id)])

        if (cardsCount > 0) {
            throw new ApiError('BANK_ACCOUNT_HAS_CARDS', 'Cannot delete a bank account that has cards linked to it.', 409)
        }

        if (transactionsCount > 0) {
            throw new ApiError('BANK_ACCOUNT_HAS_TRANSACTIONS', 'Cannot delete a bank account that has transactions linked to it.', 409)
        }

        await bankAccount.deletePixKeysByBankAccountId(id)
        await bankAccount.deleteById(id)

        reply.status(204).send()
    } catch (error) {
        handleApiError(error, reply)
    }
}
