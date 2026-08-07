import { FastifyInstance } from 'fastify'
import { find } from './find'
import { create } from './create'
import { update } from './update'
import { remove } from './remove'
import { middlewareAuthenticated } from '../../../middlewares/authenticated'

export async function categoryRoutes(app: FastifyInstance) {
    await app.register(async (instancia) => {
        instancia.addHook('preHandler', middlewareAuthenticated)

        instancia.get('/', find)
        instancia.post('/', create)
        instancia.patch('/:categoryId', update)
        instancia.delete('/:categoryId', remove)
    })
}
