import { user } from '../service'
import { handleApiError } from '../../../utils/error'
import { FastifyReply, FastifyRequest } from 'fastify'
import { extractInfosFromRequest } from '../../../utils/requestInfos'

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
    const { email, password } = request.body as { email?: string; password?: string }

    if (!email || !password) {
        reply.status(400).send({
            error: {
                code: 'REQUIRED_FIELDS_MISSING',
                message: 'Email and password are required fields.',
            },
        })
        return
    }

    try {
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
