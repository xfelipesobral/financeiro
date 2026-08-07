import { FastifyReply, FastifyRequest } from 'fastify'
import { handleApiError } from '../../../utils/error'
import { bankAccount } from '../service'
import { calculateBalances } from '../functions/calculateBalances'

export async function list(request: FastifyRequest, reply: FastifyReply) {
    try {
        const userId = request.authenticated!.userId

        const [bankAccounts, balances] = await Promise.all([bankAccount.userFindMany(userId), calculateBalances(userId)])

        reply.status(200).send(bankAccounts.map((currentBankAccount) => ({ ...currentBankAccount, balance: balances.get(currentBankAccount.id) ?? 0 })))
    } catch (error) {
        handleApiError(error, reply)
    }
}
