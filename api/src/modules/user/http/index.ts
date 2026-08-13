import { FastifyInstance, FastifyRequest } from 'fastify'
import rateLimit from '@fastify/rate-limit'

import { authenticate } from './authenticate'
import { renew } from './renew'
import { logout } from './logout'
import { me } from './me'
import { createNewUser } from './createNewUser'
import { middlewareRoot } from '../../../middlewares/root'
import { middlewareAuthenticated } from '../../../middlewares/authenticated'
import { rateLimitErrorResponseBuilder } from '../../../utils/rateLimitErrorResponse'

export async function userRoutes(app: FastifyInstance) {
    await app.register(rateLimit, {
        max: 30,
        timeWindow: '15 minutes',
        errorResponseBuilder: rateLimitErrorResponseBuilder,
    })

    app.post(
        '/login',
        {
            config: {
                rateLimit: {
                    max: 5,
                    timeWindow: '15 minutes',
                    errorResponseBuilder: rateLimitErrorResponseBuilder,
                    hook: 'preHandler',
                },
            },
        },
        authenticate,
    ) // Rota de autenticacao
    app.patch('/login', renew) // Rota de renovacao de token de autenticacao
    app.delete('/login', logout) // Rota de logout: revoga a sessão do refresh token
    app.get('/me', { preHandler: [middlewareAuthenticated] }, me) // Dados básicos do usuário autenticado
    app.post('/create', { preHandler: [middlewareRoot] }, createNewUser) // Rota de criacao de novo usuario
}
