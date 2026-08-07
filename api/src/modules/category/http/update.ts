import { FastifyReply, FastifyRequest } from 'fastify'
import { ApiError, handleApiError } from '../../../utils/error'
import { updateCategory, UpdateCategoryDTO } from '../functions/updateCategory'

export async function update(request: FastifyRequest<{ Body: UpdateCategoryDTO }>, reply: FastifyReply) {
    try {
        const { categoryId } = request.params as { categoryId?: string }

        if (!categoryId) {
            throw new ApiError('CATEGORY_ID_REQUIRED', 'Categoria é obrigatória', 400)
        }

        const id = Number(categoryId)

        if (isNaN(id)) {
            throw new ApiError('INVALID_CATEGORY_ID', 'Categoria inválida', 400)
        }

        const updatedCategory = await updateCategory(request.authenticated!.userId, id, request.body)

        reply.status(200).send(updatedCategory)
    } catch (error) {
        handleApiError(error, reply)
    }
}
