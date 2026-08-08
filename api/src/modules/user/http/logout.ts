import { FastifyReply, FastifyRequest } from 'fastify'
import { session } from '../../session/service'
import { handleApiError } from '../../../utils/error'

export async function logout(request: FastifyRequest, reply: FastifyReply) {
    try {
        const { refreshToken } = request.body as { refreshToken?: string }

        if (refreshToken) {
            await session.revokeByRawRefreshToken(refreshToken)
        }

        reply.status(204).send()
    } catch (error) {
        handleApiError(error, reply)
    }
}
