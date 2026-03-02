import { user } from '../service'
import { ApiError, handleApiError } from '../../../utils/error'
import { FastifyReply, FastifyRequest } from 'fastify'
import { extractInfosFromRequest } from '../../../utils/requestInfos'

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
    try {
        const { email, password } = request.body as { email?: string; password?: string }

        if (!email || !password) {
            throw new ApiError('REQUIRED_FIELDS_MISSING', 'Email and password are required fields.', 400)
        }

        const { ip, origin, userAgent } = extractInfosFromRequest(request)

        const { accessToken, refreshToken } = await user.authenticate(email, password, origin, userAgent, ip)

        reply.status(200).send({
            accessToken,
            refreshToken,
        })
        return
    } catch (error) {
        handleApiError(error, reply)
    }
}
