import { FastifyReply, FastifyRequest } from 'fastify'
import { handleApiError } from '../../../utils/error'
import { createCategory, CreateCategoryDTO } from '../functions/createCategory'

export async function create(request: FastifyRequest<{ Body: CreateCategoryDTO }>, reply: FastifyReply) {
    try {
        const createdCategory = await createCategory(request.authenticated!.userId, request.body)

        reply.status(201).send({
            id: createdCategory.id,
        })
    } catch (error) {
        handleApiError(error, reply)
    }
}
