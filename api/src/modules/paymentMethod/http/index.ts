import { FastifyInstance } from 'fastify'
import { list } from './list'
import { middlewareAuthenticated } from '../../../middlewares/authenticated'

export async function paymentMethodRoutes(app: FastifyInstance) {
    await app.register(async (instancia) => {
        instancia.addHook('preHandler', middlewareAuthenticated)

        instancia.get('/', list)
    })
}
