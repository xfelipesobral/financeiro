import { FastifyReply, FastifyRequest } from 'fastify'
import { ApiError, handleApiError } from '../../../utils/error'
import { updateBankAccount, UpdateBankAccountDTO } from '../functions/updateBankAccount'

export async function update(request: FastifyRequest<{ Body: UpdateBankAccountDTO }>, reply: FastifyReply) {
    try {
        const { bankAccountId } = request.params as { bankAccountId?: string }

        if (!bankAccountId) {
            throw new ApiError('BANK_ACCOUNT_ID_REQUIRED', 'Bank account ID is required.', 400)
        }

        const id = Number(bankAccountId)

        if (isNaN(id)) {
            throw new ApiError('INVALID_BANK_ACCOUNT_ID', 'Bank account ID must be a valid number.', 400)
        }

        const updatedBankAccount = await updateBankAccount(request.authenticated!.userId, id, request.body)

        reply.status(200).send(updatedBankAccount)
    } catch (error) {
        handleApiError(error, reply)
    }
}
