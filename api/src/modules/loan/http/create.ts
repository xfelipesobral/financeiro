import { FastifyReply, FastifyRequest } from 'fastify'
import { handleApiError } from '../../../utils/error'
import { createLoan, CreateLoanDTO } from '../functions/createLoan'

export async function create(request: FastifyRequest<{ Body: CreateLoanDTO }>, reply: FastifyReply) {
    try {
        const createdLoan = await createLoan(request.authenticated!.userId, request.body)

        reply.status(201).send({
            id: createdLoan.id,
        })
    } catch (error) {
        handleApiError(error, reply)
    }
}
