import { FastifyInstance, FastifyRequest } from 'fastify'
import rateLimit from '@fastify/rate-limit'

import { authenticate } from './authenticate'
import { renew } from './renew'
import { logout } from './logout'
import { createNewUser } from './createNewUser'
import { middlewareRoot } from '../../../middlewares/root'

export async function userRoutes(app: FastifyInstance) {
    // Registrado dentro desse plugin (prefix /user): só afeta as rotas daqui, não a API inteira.
    // O `max`/`timeWindow` aqui é a rede de segurança geral por IP; o login sobrescreve com um
    // limite mais estrito por conta logo abaixo.
    await app.register(rateLimit, {
        max: 30,
        timeWindow: '15 minutes',
    })

    app.post(
        '/login',
        {
            config: {
                rateLimit: {
                    max: 5,
                    timeWindow: '15 minutes',
                    hook: 'preHandler',
                },
            },
        },
        authenticate,
    ) // Rota de autenticacao
    app.patch('/login', renew) // Rota de renovacao de token de autenticacao
    app.delete('/login', logout) // Rota de logout: revoga a sessão do refresh token
    app.post('/create', { preHandler: [middlewareRoot] }, createNewUser) // Rota de criacao de novo usuario
}
