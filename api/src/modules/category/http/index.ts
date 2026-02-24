import { FastifyInstance } from 'fastify'
import { find } from './find'
import { middlewareAuthenticated } from '../../../middlewares/authenticated'

export async function categoryRoutes(app: FastifyInstance) {
    await app.register(async (instancia) => {
        instancia.addHook('preHandler', middlewareAuthenticated)

        instancia.get('/', find)
    })
}
