import { FastifyInstance } from 'fastify'
import { pay } from './pay'
import { pending } from './pending'
import { middlewareAuthenticated } from '../../../middlewares/authenticated'

export async function paymentRoutes(app: FastifyInstance) {
    await app.register(async (instancia) => {
        instancia.addHook('preHandler', middlewareAuthenticated)

        instancia.get('/pending', pending)
        instancia.patch('/:paymentId/pay', pay)
    })
}
