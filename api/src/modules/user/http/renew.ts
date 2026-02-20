import { session } from '../../session/service'
import { ApiError, handleApiError } from '../../../utils/error'
import { FastifyReply, FastifyRequest } from 'fastify'
import { extractInfosFromRequest } from '../../../utils/requestInfos'

export async function renew(request: FastifyRequest, reply: FastifyReply) {
    const { refreshToken } = request.body as { refreshToken?: string }

    if (!refreshToken) {
        throw new ApiError('REQUIRED_FIELDS_MISSING', 'Refresh token is a required field.', 400)
    }

    try {
        const { origin, userAgent } = extractInfosFromRequest(request)

        const accessToken = await session.renew(refreshToken, origin, userAgent)
        reply.status(200).send({ accessToken })
        return
    } catch (error) {
        handleApiError(error, reply)
    }
}
