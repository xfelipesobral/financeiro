import { FastifyReply, FastifyRequest } from 'fastify'
import { verifyAccessToken } from '../utils/token'
import { ApiError, handleApiError } from '../utils/error'
import { session, SessionJwtPayload } from '../modules/session'

export async function middlewareAuthenticated(request: FastifyRequest, reply: FastifyReply) {
    const accessToken = request.headers['authorization'] as string | undefined

    if (!accessToken || !accessToken.startsWith('Bearer')) {
        reply.status(400).send({
            error: {
                code: 'INVALID_AUTHORIZATION_HEADER',
                message: 'Authorization header is missing or invalid.',
            },
        })
        return
    }

    const token = accessToken.slice(7).trim() // 'Bearer '.length === 7

    if (!token) {
        reply.status(400).send({
            error: {
                code: 'INVALID_AUTHORIZATION_HEADER',
                message: 'Authorization header is missing or invalid.',
            },
        })
        return
    }

    try {
        let tokenPayload: SessionJwtPayload | null = null

        try {
            tokenPayload = verifyAccessToken(token) as SessionJwtPayload
        } catch (e) {
            throw new ApiError('INVALID_TOKEN', 'The token is invalid.', 401)
        }

        if (!tokenPayload || typeof tokenPayload !== 'object') {
            throw new ApiError('INVALID_TOKEN', 'The token payload is invalid.', 401)
        }

        const userId = Number(tokenPayload.sub)

        if (isNaN(userId)) {
            throw new ApiError('INVALID_USER_ID', 'The user ID in the token is invalid.', 401)
        }

        if (!tokenPayload.jti) {
            throw new ApiError('INVALID_TOKEN', 'Token is missing JTI claim.', 401)
        }

        const tokenInfo = await session.findByGuid(tokenPayload.jti)

        if (!tokenInfo) {
            throw new ApiError('INVALID_TOKEN', 'The token is invalid.', 401)
        }

        if (tokenInfo.userId !== userId) {
            throw new ApiError('INVALID_TOKEN', 'Token does not match session owner.', 401)
        }

        if (tokenInfo.revokedAt) {
            throw new ApiError('TOKEN_REVOKED', 'The token has been revoked.', 401)
        }

        request.user = { id: userId }
    } catch (e) {
        handleApiError(e, reply)
        return
    }
}
