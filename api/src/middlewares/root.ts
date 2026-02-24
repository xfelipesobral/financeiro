import { FastifyReply, FastifyRequest } from 'fastify'
import { ApiError, handleApiError } from '../utils/error'

export async function middlewareRoot(request: FastifyRequest, reply: FastifyReply) {
    const apiRootKey = request.headers['x-api-key'] as string | undefined

    if (!apiRootKey) {
        reply.status(400).send({
            error: {
                code: 'INVALID_API_ROOT_KEY',
                message: 'API root key is missing or invalid.',
            },
        })
        return
    }

    try {
        const expectedApiRootKey = process.env.ADMIN_SECRET || 'admin'

        if (apiRootKey !== expectedApiRootKey) {
            throw new ApiError('INVALID_API_ROOT_KEY', 'API root key is missing or invalid.', 400)
        }
    } catch (e) {
        handleApiError(e, reply)
        return
    }
}
