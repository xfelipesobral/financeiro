import { FastifyReply, FastifyRequest } from 'fastify'
import { handleApiError } from '../../../utils/error'
import { bankAccount } from '../service'

export async function list(request: FastifyRequest, reply: FastifyReply) {
    try {
        const bankAccounts = await bankAccount.userFindMany(request.authenticated!.userId)

        reply.status(200).send(bankAccounts)
    } catch (error) {
        handleApiError(error, reply)
    }
}
