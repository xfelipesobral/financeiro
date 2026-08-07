import { FastifyReply, FastifyRequest } from 'fastify'
import { ApiError, handleApiError } from '../../../utils/error'
import { removeCategory } from '../functions/removeCategory'

export async function remove(request: FastifyRequest, reply: FastifyReply) {
    try {
        const { categoryId } = request.params as { categoryId?: string }

        if (!categoryId) {
            throw new ApiError('CATEGORY_ID_REQUIRED', 'Categoria é obrigatória', 400)
        }

        const id = Number(categoryId)

        if (isNaN(id)) {
            throw new ApiError('INVALID_CATEGORY_ID', 'Categoria inválida', 400)
        }

        await removeCategory(request.authenticated!.userId, id)

        reply.status(204).send()
    } catch (error) {
        handleApiError(error, reply)
    }
}
