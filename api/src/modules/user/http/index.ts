import { FastifyInstance } from 'fastify'

import { authenticate } from './authenticate'
import { renew } from './renew'

export async function userRoutes(app: FastifyInstance) {
    app.post('/login', authenticate) // Rota de autenticacao
    app.patch('/login', renew) // Rota de renovacao de token de autenticacao
    // app.get('/me', { preHandler: [middlewareAutenticado] }, eu)
}
