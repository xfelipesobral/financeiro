import { FastifyReply, FastifyRequest } from 'fastify'
import { user } from '../service'
import { ApiError, handleApiError } from '../../../utils/error'

export async function me(request: FastifyRequest, reply: FastifyReply) {
    try {
        const userId = request.authenticated!.userId
        const currentUser = await user.findById(userId)

        if (!currentUser) {
            throw new ApiError('USER_NOT_FOUND', 'Usuário não encontrado', 404)
        }

        reply.status(200).send({
            firstName: currentUser.firstName,
            lastName: currentUser.lastName,
            email: currentUser.email,
        })
    } catch (error) {
        handleApiError(error, reply)
    }
}
