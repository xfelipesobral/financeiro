import { FastifyReply, FastifyRequest } from 'fastify'
import { handleApiError } from '../../../utils/error'
import { createBankAccount, CreateBankAccountDTO } from '../functions/createBankAccount'

export async function create(request: FastifyRequest<{ Body: CreateBankAccountDTO }>, reply: FastifyReply) {
    try {
        const createdBankAccount = await createBankAccount(request.authenticated!.userId, request.body)

        reply.status(201).send(createdBankAccount)
    } catch (error) {
        handleApiError(error, reply)
    }
}
